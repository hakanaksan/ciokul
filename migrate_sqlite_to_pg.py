"""Copies data/cio_okul.sqlite3 into the PostgreSQL database named by DATABASE_URL.

    DATABASE_URL=postgresql://... python migrate_sqlite_to_pg.py [--sqlite PATH] [--replace]

Runs in one transaction: creates the schema, copies every table, moves the id sequences
past the copied ids and compares row counts. Without --replace it refuses to write into
tables that already hold rows; with --replace those rows are deleted first.
"""

from __future__ import annotations

import argparse
import sqlite3
import sys
from contextlib import closing
from pathlib import Path

import database

# Parents before children, so foreign keys are satisfied while copying.
TABLES = [
    "users", "booklets", "questions", "choices", "assignments", "assignment_questions",
    "responses", "reviews", "question_flags", "plan_overrides", "settings", "mistake_resolutions",
    "reading_sections", "reading_questions", "reading_assignments", "reading_responses",
    "reading_reviews", "reading_image_checks", "study_reflections", "study_repeat_queue",
]
IDENTITY_TABLES = ("booklets", "questions", "assignments", "reading_sections", "reading_assignments")


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

    with closing(sqlite3.connect(f"file:{source_path.as_posix()}?mode=ro", uri=True)) as source:
        source.row_factory = sqlite3.Row
        if source.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            sys.exit("SQLite dosyası bozuk.")
        broken = source.execute("PRAGMA foreign_key_check").fetchall()
        if broken:
            sys.exit(f"SQLite'ta yabancı anahtarı tutmayan {len(broken)} satır var: {[tuple(r) for r in broken[:5]]}")
        present = {row[0] for row in source.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        missing = [table for table in TABLES if table not in present]
        if missing:
            sys.exit(f"SQLite'ta beklenen tablolar yok: {missing}")

        with database.connect() as target:
            database.apply_postgres_schema(target)
            filled = [t for t in TABLES if target.execute(f"SELECT EXISTS(SELECT 1 FROM {t})").fetchone()[0]]
            if filled and not args.replace:
                sys.exit(f"Hedefte veri var ({', '.join(filled)}). Üzerine yazmak için --replace kullanın.")
            if filled:
                target.execute(f"TRUNCATE {', '.join(TABLES)} RESTART IDENTITY")
            report = []
            for table in TABLES:
                columns = [row[1] for row in source.execute(f"PRAGMA table_info({table})")]
                target_columns = {row[0] for row in target.execute(
                    """SELECT column_name FROM information_schema.columns
                       WHERE table_schema = current_schema() AND table_name = ?""", (table,))}
                unknown = [c for c in columns if c not in target_columns]
                if unknown:
                    raise SystemExit(f"{table}: PostgreSQL şemasında olmayan sütunlar: {unknown}")
                data = [tuple(row) for row in source.execute(f"SELECT {', '.join(columns)} FROM {table}")]
                if data:
                    target.executemany(
                        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join('?' * len(columns))})", data)
                copied = target.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
                if copied != len(data):
                    raise SystemExit(f"{table}: {len(data)} satır okundu, {copied} satır yazıldı.")
                report.append((table, copied))
            database.sync_identities(target, IDENTITY_TABLES)
    database.close_pool()
    width = max(len(table) for table, _ in report)
    for table, count in report:
        print(f"{table:<{width}}  {count}")
    print(f"Tamam: {sum(count for _, count in report)} satır taşındı.")


if __name__ == "__main__":
    main()
