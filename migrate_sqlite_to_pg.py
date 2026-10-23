"""Copies data/cio_okul.sqlite3 into the PostgreSQL database named by DATABASE_URL.

    DATABASE_URL=postgresql://... python migrate_sqlite_to_pg.py [--sqlite PATH] [--replace]

Runs in one transaction: creates the schema, copies every table, moves the id sequences
past the copied ids and compares row counts. Without --replace it refuses to write into
tables that already hold rows; with --replace those rows are deleted first.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import data_export
import database


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--sqlite", default=str(Path(__file__).resolve().parent / "data" / "cio_okul.sqlite3"))
    parser.add_argument("--replace", action="store_true", help="hedef tablolardaki mevcut satırları sil")
    args = parser.parse_args()
    if not database.IS_POSTGRES:
        sys.exit("DATABASE_URL bir PostgreSQL adresi olmalı.")
    source_path = Path(args.sqlite)
    if not source_path.is_file():
        sys.exit(f"SQLite dosyası bulunamadı: {source_path}")
    try:
        payload = data_export.read_sqlite(source_path)
    except ValueError as exc:
        sys.exit(f"SQLite dosyası okunamadı: {exc}")

    with database.connect() as target:
        database.apply_postgres_schema(target)
        filled = [t for t in data_export.TABLES if target.execute(f"SELECT EXISTS(SELECT 1 FROM {t})").fetchone()[0]]
        if filled and not args.replace:
            sys.exit(f"Hedefte veri var ({', '.join(filled)}). Üzerine yazmak için --replace kullanın.")
        counts = data_export.restore_tables(target, payload)
        for table, expected in counts.items():
            copied = target.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
            if copied != expected:
                raise SystemExit(f"{table}: {expected} satır okundu, {copied} satır yazıldı.")
    database.close_pool()
    width = max(len(table) for table in counts)
    for table, count in counts.items():
        print(f"{table:<{width}}  {count}")
    print(f"Tamam: {sum(counts.values())} satır taşındı.")


if __name__ == "__main__":
    main()
