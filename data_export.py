"""Backend-independent backups: every table as JSON, readable from SQLite and restorable into either backend."""

from __future__ import annotations

import sqlite3
from contextlib import closing
from datetime import datetime, timezone

import database

FORMAT = "cio-okul-yedek-v2"
# Parents before children, so foreign keys hold while rows are inserted. Sessions are not backed up.
TABLES = [
    "users", "booklets", "questions", "choices", "assignments", "assignment_questions",
    "responses", "reviews", "question_flags", "plan_overrides", "settings", "mistake_resolutions",
    "reading_sections", "reading_questions", "reading_assignments", "reading_responses",
    "reading_reviews", "reading_image_checks", "study_reflections", "study_repeat_queue",
]
IDENTITY_TABLES = ("booklets", "questions", "assignments", "reading_sections", "reading_assignments")
REQUIRED_TABLES = {"users", "booklets", "questions", "assignments", "responses", "reviews"}


def table_columns(db, table):
    if database.IS_POSTGRES:
        return [row[0] for row in db.execute(
            """SELECT column_name FROM information_schema.columns
               WHERE table_schema = current_schema() AND table_name = ? ORDER BY ordinal_position""", (table,))]
    return [row[1] for row in db.execute(f"PRAGMA table_info({table})")]


def export_tables(db):
    tables = {}
    for table in TABLES:
        columns = table_columns(db, table)
        rows = [list(row) for row in db.execute(f"SELECT {', '.join(columns)} FROM {table}")]
        tables[table] = {"columns": columns, "rows": rows}
    return {"format": FORMAT, "created_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            "tables": tables}


def read_sqlite(path):
    """Reads a SQLite database file (old backups, the local app) into the export format."""
    with closing(sqlite3.connect(f"file:{path.as_posix()}?mode=ro", uri=True)) as source:
        if source.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            raise ValueError("Yedek veritabanı bozuk.")
        if source.execute("PRAGMA foreign_key_check").fetchone():
            raise ValueError("Yedek veritabanında birbirini tutmayan kayıtlar var.")
        present = {row[0] for row in source.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        if not REQUIRED_TABLES.issubset(present):
            raise ValueError("Yedek bu uygulamaya ait değil.")
        tables = {}
        for table in TABLES:
            if table not in present:
                continue
            columns = [row[1] for row in source.execute(f"PRAGMA table_info({table})")]
            rows = [list(row) for row in source.execute(f"SELECT {', '.join(columns)} FROM {table}")]
            tables[table] = {"columns": columns, "rows": rows}
    return {"format": FORMAT, "created_at": None, "tables": tables}


def validate(db, payload):
    if not isinstance(payload, dict) or payload.get("format") != FORMAT or not isinstance(payload.get("tables"), dict):
        raise ValueError("Yedek bu uygulamaya ait değil.")
    tables = payload["tables"]
    unknown = set(tables) - set(TABLES)
    if unknown or not REQUIRED_TABLES.issubset(tables):
        raise ValueError("Yedekte beklenmeyen veya eksik tablolar var.")
    for table, content in tables.items():
        columns, rows = content.get("columns"), content.get("rows")
        if (not isinstance(columns, list) or not columns or not isinstance(rows, list)
                or not set(columns).issubset(table_columns(db, table))):
            raise ValueError(f"Yedekteki {table} tablosu bu sürümle uyumlu değil.")
        if any(not isinstance(row, list) or len(row) != len(columns) or
               any(value is not None and not isinstance(value, (str, int, float)) for value in row) for row in rows):
            raise ValueError(f"Yedekteki {table} tablosunda geçersiz satır var.")


def restore_tables(db, payload):
    """Replaces every table with the backup inside the caller's transaction; returns row counts."""
    validate(db, payload)
    for table in reversed(TABLES):
        db.execute(f"DELETE FROM {table}")
    counts = {}
    for table in TABLES:
        content = payload["tables"].get(table)
        if not content or not content["rows"]:
            counts[table] = 0
            continue
        columns = content["columns"]
        db.executemany(f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' * len(columns))})",
                       [tuple(row) for row in content["rows"]])
        counts[table] = len(content["rows"])
    database.sync_identities(db, IDENTITY_TABLES)
    return counts
