"""Database connections: SQLite locally, PostgreSQL when DATABASE_URL is set.

Both backends return the same wrapper, so callers keep the sqlite3 style:
`?` placeholders, rows readable by index and by column name, and
`with connect() as db:` committing (or rolling back) and releasing the connection.
"""

from __future__ import annotations

import os
import re
import sqlite3
import threading
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path

DATABASE_URL = os.environ.get("DATABASE_URL", "").strip()
IS_POSTGRES = DATABASE_URL.startswith(("postgres://", "postgresql://"))
SCHEMA_FILE = Path(__file__).resolve().parent / "schema_postgres.sql"

if IS_POSTGRES:
    import psycopg
    from psycopg.adapt import Loader
    from psycopg.types.numeric import FloatLoader
    from psycopg_pool import ConnectionPool
    ERRORS: tuple[type[Exception], ...] = (sqlite3.Error, psycopg.Error)

    class _IntBoolLoader(Loader):
        """Booleans come back as 0/1, as SQLite returns them (EXISTS(...), comparisons)."""

        def load(self, data):
            return 1 if bytes(data) == b"t" else 0
else:
    ERRORS = (sqlite3.Error,)

_POOL = None
_POOL_LOCK = threading.Lock()
_WORD = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


def local_date(value):
    """SQLite LOCAL_DATE(): the local calendar day of a UTC 'YYYY-MM-DD HH:MM:SS' value."""
    if value is None:
        return None
    try:
        moment = datetime.fromisoformat(str(value))
    except ValueError:
        return None
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone().date().isoformat()


class Row:
    """Read-only row like sqlite3.Row: row[0], row["name"], dict(row), unpacking."""

    __slots__ = ("_names", "_index", "_values")

    def __init__(self, names, index, values):
        self._names, self._index, self._values = names, index, tuple(values)

    def __getitem__(self, key):
        if isinstance(key, str):
            try:
                return self._values[self._index[key.lower()]]
            except KeyError:
                raise IndexError(f"No item with that key: {key}") from None
        return self._values[key]

    def keys(self):
        return list(self._names)

    def __iter__(self):
        return iter(self._values)

    def __len__(self):
        return len(self._values)

    def __eq__(self, other):
        if isinstance(other, Row):
            return self._names == other._names and self._values == other._values
        return NotImplemented

    def __hash__(self):
        return hash((self._names, self._values))

    def __repr__(self):
        return f"Row({dict(zip(self._names, self._values))!r})"


def _pg_row_factory(cursor):
    if not cursor.description:
        return lambda values: values
    names = tuple(column.name for column in cursor.description)
    index = {name.lower(): position for position, name in reversed(list(enumerate(names)))}
    return lambda values: Row(names, index, values)


@lru_cache(maxsize=1024)
def to_postgres(sql, with_params=True):
    """Rewrites a SQLite query for psycopg.

    Outside string literals CURRENT_TIMESTAMP becomes cio_now() (SQLite's text format).
    With parameters, `?` becomes `%s` and a literal `%` becomes `%%`.
    """
    out, quote, i = [], None, 0
    percent = "%%" if with_params else "%"
    while i < len(sql):
        ch = sql[i]
        if quote:
            if ch == quote:
                quote = None
            out.append(percent if ch == "%" else ch)
        elif ch in "'\"":
            quote = ch
            out.append(ch)
        elif ch == "-" and sql.startswith("--", i):
            end = sql.find("\n", i)
            end = len(sql) if end == -1 else end
            out.append(sql[i:end].replace("%", percent))
            i = end
            continue
        elif ch.isascii() and (ch.isalpha() or ch == "_"):
            word = _WORD.match(sql, i).group()
            out.append("cio_now()" if word.upper() == "CURRENT_TIMESTAMP" else word)
            i += len(word)
            continue
        elif ch == "?" and with_params:
            out.append("%s")
        elif ch == "%":
            out.append(percent)
        else:
            out.append(ch)
        i += 1
    return "".join(out)


def _pg_params(params):
    # SQLite stores True/False as 1/0; PostgreSQL would reject a boolean for an INTEGER column.
    return tuple(int(value) if isinstance(value, bool) else value for value in params)


class Connection:
    """Wraps a sqlite3 or psycopg connection behind the sqlite3 API this app uses."""

    def __init__(self, raw, release):
        self._raw, self._release = raw, release

    @property
    def raw(self):
        if self._raw is None:
            raise RuntimeError("Veritabanı bağlantısı kapatıldı.")
        return self._raw

    def execute(self, sql, params=()):
        if not IS_POSTGRES:
            return self.raw.execute(sql, params)
        cursor = self.raw.cursor()
        if params:
            cursor.execute(to_postgres(sql), _pg_params(params))
        else:
            cursor.execute(to_postgres(sql, False))
        return cursor

    def executemany(self, sql, seq_of_params):
        if not IS_POSTGRES:
            return self.raw.executemany(sql, seq_of_params)
        cursor = self.raw.cursor()
        cursor.executemany(to_postgres(sql), [_pg_params(params) for params in seq_of_params])
        return cursor

    def executescript(self, script):
        if not IS_POSTGRES:
            return self.raw.executescript(script)
        return self.raw.execute(script)

    def commit(self):
        self.raw.commit()

    def rollback(self):
        self.raw.rollback()

    def backup(self, target):
        if IS_POSTGRES:
            raise RuntimeError("PostgreSQL bağlantısında SQLite yedeği alınamaz.")
        self.raw.backup(target)

    def close(self):
        raw, self._raw = self._raw, None
        if raw is not None:
            self._release(raw)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        try:
            if self._raw is not None:
                if exc_type is None:
                    self._raw.commit()
                else:
                    self._raw.rollback()
        finally:
            self.close()
        return False


def _configure(connection):
    connection.adapters.register_loader("numeric", FloatLoader)
    connection.adapters.register_loader("bool", _IntBoolLoader)


def _pool():
    global _POOL
    with _POOL_LOCK:
        if _POOL is None:
            # prepare_threshold=None: PgBouncer (transaction mode) cannot keep prepared statements.
            _POOL = ConnectionPool(
                DATABASE_URL,
                min_size=1,
                max_size=int(os.environ.get("DB_POOL_SIZE", "5")),
                kwargs={"prepare_threshold": None, "row_factory": _pg_row_factory},
                configure=_configure,
                open=True,
            )
        return _POOL


def connect(sqlite_path=None, functions=None):
    """Returns a connection; sqlite_path and functions apply only to the SQLite backend.

    PostgreSQL provides the same SQL functions from schema_postgres.sql.
    """
    if IS_POSTGRES:
        pool = _pool()
        return Connection(pool.getconn(), pool.putconn)
    raw = sqlite3.connect(sqlite_path, timeout=30)
    raw.row_factory = sqlite3.Row
    raw.execute("PRAGMA foreign_keys=ON")
    raw.create_function("LOCAL_DATE", 1, local_date)
    for name, function in (functions or {}).items():
        raw.create_function(name, 1, function)
    return Connection(raw, lambda connection: connection.close())


def apply_postgres_schema(db):
    db.executescript(SCHEMA_FILE.read_text(encoding="utf-8"))


def sync_identities(db, tables):
    """After rows were inserted with explicit ids, moves each id sequence past the largest id."""
    if not IS_POSTGRES:
        return
    for table in tables:
        db.execute(f"""SELECT setval(pg_get_serial_sequence('{table}', 'id'),
            COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM {table}""")


def close_pool():
    global _POOL
    with _POOL_LOCK:
        if _POOL is not None:
            _POOL.close()
            _POOL = None
