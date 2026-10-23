"""Shared reflection, spaced review and weekly summary features."""

from datetime import date, timedelta

import database

REASONS = {
    "": "Belirtilmedi", "topic": "Konuyu öğrenmeli", "reading": "Soruyu yanlış okudu",
    "attention": "Dikkat hatası", "method": "Yöntemi geliştirmeli", "other": "Diğer",
}
SKILL_NAMES = {"locate": "Metinden bilgi bulma", "inference": "Çıkarım yapma",
               "comment": "Yorumlama", "visual": "Tablo ve görsel okuma"}
INTERVALS = (2, 7, 21)


def install(db):
    if database.IS_POSTGRES:  # tables come from schema_postgres.sql
        return
    db.executescript("""
    CREATE TABLE IF NOT EXISTS study_reflections (
      kind TEXT NOT NULL CHECK(kind IN ('test','reading')),
      assignment_id INTEGER NOT NULL, item_key TEXT NOT NULL,
      uncertain INTEGER NOT NULL DEFAULT 0, reason TEXT NOT NULL DEFAULT '',
      PRIMARY KEY(kind,assignment_id,item_key));
    CREATE TABLE IF NOT EXISTS study_repeat_queue (
      kind TEXT NOT NULL CHECK(kind IN ('test','reading')),
      item_key TEXT NOT NULL, stage INTEGER NOT NULL DEFAULT 0,
      due_date TEXT NOT NULL, source_assignment_id INTEGER NOT NULL,
      assigned_assignment_id INTEGER,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(kind,item_key));
    """)
    columns = {row[1] for row in db.execute("PRAGMA table_info(study_repeat_queue)")}
    if "assigned_assignment_id" not in columns:
        db.execute("ALTER TABLE study_repeat_queue ADD COLUMN assigned_assignment_id INTEGER")


def item_key(kind, section_or_question, number=None):
    return str(section_or_question) if kind == "test" else f"{section_or_question}:{number}"


def set_uncertain(db, kind, aid, key, uncertain):
    if type(uncertain) is not bool:
        raise ValueError("Eminlik seçimi geçersiz.")
    db.execute("""INSERT INTO study_reflections(kind,assignment_id,item_key,uncertain)
        VALUES (?,?,?,?) ON CONFLICT(kind,assignment_id,item_key) DO UPDATE SET uncertain=excluded.uncertain""",
        (kind, aid, key, int(uncertain)))


def set_reason(db, kind, aid, key, reason):
    if reason not in REASONS:
        raise ValueError("Zorlanma nedeni geçersiz.")
    db.execute("""INSERT INTO study_reflections(kind,assignment_id,item_key,reason)
        VALUES (?,?,?,?) ON CONFLICT(kind,assignment_id,item_key) DO UPDATE SET reason=excluded.reason""",
        (kind, aid, key, reason))


def record_review(db, kind, aid, key, success):
    previous = db.execute("SELECT stage,source_assignment_id FROM study_repeat_queue WHERE kind=? AND item_key=?",
                          (kind, key)).fetchone()
    if not success:
        stage = 0
    elif previous and previous["source_assignment_id"] != aid:
        stage = previous["stage"] + 1
    elif previous:
        db.execute("DELETE FROM study_repeat_queue WHERE kind=? AND item_key=?", (kind, key))
        return
    else:
        return
    if stage >= len(INTERVALS):
        db.execute("DELETE FROM study_repeat_queue WHERE kind=? AND item_key=?", (kind, key))
        return
    due = (date.today() + timedelta(days=INTERVALS[stage])).isoformat()
    db.execute("""INSERT INTO study_repeat_queue(kind,item_key,stage,due_date,source_assignment_id)
        VALUES (?,?,?,?,?) ON CONFLICT(kind,item_key) DO UPDATE SET
        stage=excluded.stage,due_date=excluded.due_date,
        source_assignment_id=excluded.source_assignment_id,assigned_assignment_id=NULL,
        updated_at=CURRENT_TIMESTAMP""",
        (kind, key, stage, due, aid))


def delete_assignment(db, kind, aid):
    db.execute("DELETE FROM study_reflections WHERE kind=? AND assignment_id=?", (kind, aid))
    db.execute("DELETE FROM study_repeat_queue WHERE kind=? AND source_assignment_id=?", (kind, aid))
    db.execute("UPDATE study_repeat_queue SET assigned_assignment_id=NULL WHERE kind=? AND assigned_assignment_id=?", (kind, aid))


def mark_dispatched(db, kind, aid, keys):
    today = date.today().isoformat()
    db.executemany("""UPDATE study_repeat_queue SET assigned_assignment_id=?
        WHERE kind=? AND item_key=? AND due_date<=? AND assigned_assignment_id IS NULL""",
        [(aid, kind, key, today) for key in keys])


def dashboard(db):
    today = date.today().isoformat()
    monday = (date.today() - timedelta(days=date.today().weekday())).isoformat()
    sunday = (date.today() + timedelta(days=6-date.today().weekday())).isoformat()
    previous_monday = (date.fromisoformat(monday) - timedelta(days=7)).isoformat()
    previous_sunday = (date.fromisoformat(monday) - timedelta(days=1)).isoformat()
    queue = [dict(row) for row in db.execute("""SELECT k.*,q.number,b.course,b.title AS unit_title,
        NULL AS section_id,NULL AS reading_title,
        COALESCE(f.reason,'') AS reason FROM study_repeat_queue k
        JOIN questions q ON CAST(q.id AS TEXT)=k.item_key JOIN booklets b ON b.id=q.booklet_id
        LEFT JOIN study_reflections f ON f.kind='test' AND f.assignment_id=k.source_assignment_id AND f.item_key=k.item_key
        WHERE k.kind='test' UNION ALL
        SELECT k.*,q.number,'Okuma Becerileri' AS course,NULL AS unit_title,
        q.section_id,s.title AS reading_title,COALESCE(f.reason,'') AS reason
        FROM study_repeat_queue k JOIN reading_questions q
          ON k.item_key=CAST(q.section_id AS TEXT)||':'||CAST(q.number AS TEXT)
        JOIN reading_sections s ON s.id=q.section_id
        LEFT JOIN study_reflections f ON f.kind='reading' AND f.assignment_id=k.source_assignment_id AND f.item_key=k.item_key
        WHERE k.kind='reading' ORDER BY due_date,kind,course,number""")]
    def count(sql, args=()): return db.execute(sql, args).fetchone()[0]
    pending_test = count("""SELECT COUNT(*) FROM assignments a WHERE a.submitted_at IS NOT NULL AND
        (SELECT COUNT(*) FROM reviews v WHERE v.assignment_id=a.id) <
        (SELECT COUNT(*) FROM assignment_questions aq WHERE aq.assignment_id=a.id)""")
    pending_reading = count("""SELECT COUNT(*) FROM reading_assignments a WHERE a.submitted_at IS NOT NULL AND
        (SELECT COUNT(*) FROM reading_reviews v WHERE v.assignment_id=a.id) <
        (SELECT COUNT(*) FROM reading_questions q WHERE q.section_id=a.section_id AND
        (a.question_numbers_json IS NULL OR EXISTS
          (SELECT 1 FROM json_each(a.question_numbers_json) j WHERE CAST(j.value AS INTEGER)=q.number)))""")
    skill_sql = """SELECT q.skill,COUNT(*) AS total,SUM(v.score) AS earned,SUM(q.max_score) AS possible
        FROM reading_reviews v JOIN reading_assignments a ON a.id=v.assignment_id
        JOIN reading_questions q ON q.section_id=a.section_id AND q.number=v.number
        WHERE LOCAL_DATE(v.reviewed_at) BETWEEN ? AND ? GROUP BY q.skill"""
    current_skills = {r["skill"]: dict(r) for r in db.execute(skill_sql, (monday, sunday))}
    previous_skills = {r["skill"]: dict(r) for r in db.execute(skill_sql, (previous_monday, previous_sunday))}
    improving = []
    for skill, current in current_skills.items():
        previous = previous_skills.get(skill)
        if previous and current["possible"] and previous["possible"]:
            now = round(current["earned"] / current["possible"] * 100)
            before = round(previous["earned"] / previous["possible"] * 100)
            if now > before:
                improving.append({"name": SKILL_NAMES.get(skill, skill), "before": before, "now": now})
    week_series = []
    for offset in range(7, -1, -1):
        start = date.fromisoformat(monday) - timedelta(days=offset * 7)
        end = start + timedelta(days=6)
        bounds = (start.isoformat(), end.isoformat())
        week_series.append({
            "start": bounds[0],
            "assigned": count("SELECT COUNT(*) FROM assignments WHERE LOCAL_DATE(created_at) BETWEEN ? AND ?", bounds) +
                        count("SELECT COUNT(*) FROM reading_assignments WHERE LOCAL_DATE(created_at) BETWEEN ? AND ?", bounds),
            "submitted": count("SELECT COUNT(*) FROM assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?", bounds) +
                         count("SELECT COUNT(*) FROM reading_assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?", bounds),
        })
    return {
        "today": today, "weekStart": monday, "weekEnd": sunday,
        "queue": queue, "dueCount": sum(x["due_date"] <= today and not x["assigned_assignment_id"] for x in queue),
        "week": {
            "assigned": count("SELECT COUNT(*) FROM assignments WHERE LOCAL_DATE(created_at) BETWEEN ? AND ?", (monday,sunday)) +
                        count("SELECT COUNT(*) FROM reading_assignments WHERE LOCAL_DATE(created_at) BETWEEN ? AND ?", (monday,sunday)),
            "submitted": count("SELECT COUNT(*) FROM assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?", (monday,sunday)) +
                         count("SELECT COUNT(*) FROM reading_assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?", (monday,sunday)),
            "reviewedQuestions": count("SELECT COUNT(*) FROM reviews WHERE LOCAL_DATE(reviewed_at) BETWEEN ? AND ?", (monday,sunday)) +
                                 count("SELECT COUNT(*) FROM reading_reviews WHERE LOCAL_DATE(reviewed_at) BETWEEN ? AND ?", (monday,sunday)),
            "uncertain": count("SELECT COUNT(*) FROM study_reflections WHERE uncertain=1 AND kind='test' AND assignment_id IN (SELECT id FROM assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?)", (monday,sunday)) +
                         count("SELECT COUNT(*) FROM study_reflections WHERE uncertain=1 AND kind='reading' AND assignment_id IN (SELECT id FROM reading_assignments WHERE LOCAL_DATE(submitted_at) BETWEEN ? AND ?)", (monday,sunday)),
            "pendingReviews": pending_test + pending_reading,
            "dueReviews": sum(x["due_date"] <= today and not x["assigned_assignment_id"] for x in queue),
        },
        "reasons": [dict(row) for row in db.execute("""SELECT reason,COUNT(*) AS total FROM study_reflections
            WHERE reason<>'' GROUP BY reason ORDER BY total DESC""")],
        "improvingSkills": improving,
        "weekSeries": week_series,
    }
