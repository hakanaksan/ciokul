"""Bugünün planı: a short list of steps for the student's day.

The plan is made the first time anyone opens it on a day and then kept, so steps do not move
around while the child works. A step is done when the work itself is done (the assignment is
submitted, the lesson quiz is finished today, mistakes are marked solved today); nobody ticks it.
Work the parent assigns later with today's (or an earlier) target date is added to the plan.
"""

from __future__ import annotations

import json
from datetime import date

import database
import lessons
import reading_module
import stories
from study_features import student_mistakes

SIZES = {2: "Hafif", 3: "Normal", 4: "Yoğun"}
DEFAULT_SIZE = 3
MISTAKE_STEP = 3  # mistakes to retry in one step

SCHEMA_SQLITE = """
CREATE TABLE IF NOT EXISTS daily_plans (
  day TEXT PRIMARY KEY,
  items TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);
"""


def size(db):
    row = db.execute("SELECT value FROM settings WHERE key = 'daily_plan_size'").fetchone()
    try:
        value = int(row[0]) if row else DEFAULT_SIZE
    except ValueError:
        value = DEFAULT_SIZE
    return value if value in SIZES else DEFAULT_SIZE


def set_size(db, value):
    if type(value) is not int or value not in SIZES:
        raise ValueError("Günlük plan büyüklüğü geçersiz.")
    db.execute("""INSERT INTO settings(key, value) VALUES ('daily_plan_size', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value""", (str(value),))
    # Today's plan is made again at the new size; steps already done stay in it.
    today = date.today().isoformat()
    row = db.execute("SELECT items FROM daily_plans WHERE day = ?", (today,)).fetchone()
    if row:
        kept = [item for item in _detail(db, today, json.loads(row[0])) if item["done"]]
        items = _fill(db, today, [_stored(item) for item in kept], value)
        db.execute("UPDATE daily_plans SET items = ? WHERE day = ?", (json.dumps(items), today))


def _tr_lower(text):
    return str(text or "").replace("I", "ı").replace("İ", "i").lower()


def lesson_for_question(catalog, course, text, booklet):
    """Same rule as lessonForQuestion in web/lessons.js: the lesson with the most keywords wins."""
    value = _tr_lower(text)
    best, best_hits = None, 0
    for lesson in catalog:
        match = lesson.get("match") or {}
        if (match.get("course") and match["course"] != course) or (
                match.get("booklet") and booklet and match["booklet"] != booklet):
            continue
        hits = sum(1 for k in match.get("keywords", []) if _tr_lower(k) in value)
        if hits > best_hits:
            best, best_hits = lesson, hits
    return best


def _open_work(db):
    """Assignments not submitted yet: overdue and nearest target date first, then the oldest."""
    tests = [dict(r, kind="test") for r in db.execute(
        "SELECT id, title, due_date, created_at FROM assignments WHERE submitted_at IS NULL")]
    readings = [dict(r, kind="reading") for r in db.execute(
        "SELECT id, title, due_date, created_at FROM reading_assignments WHERE submitted_at IS NULL")]
    return sorted(tests + readings, key=lambda w: (w["due_date"] or "9999-99-99", w["created_at"], w["id"]))


def _lesson_unfinished(lesson):
    p = lesson["progress"]
    return not p or not p["quiz_total"] or p["best_score"] < p["quiz_total"]


def _fill(db, today, items, limit):
    """Adds steps to items (stored form) until there are limit of them."""
    def has(kind, key=None):
        return any(i["kind"] == kind and (key is None or i.get("id") == key) for i in items)

    work = [w for w in _open_work(db) if not has(w["kind"], w["id"])]
    catalog = lessons.catalog(db)
    pending = [m for m in student_mistakes(db) if not m.get("resolved_at")]

    def mistake_lesson():
        for m in pending:
            lesson = lesson_for_question(catalog, m["course"], m["stem"], m["booklet_title"])
            if lesson and _lesson_unfinished(lesson) and not has("lesson", lesson["id"]):
                return {"kind": "lesson", "id": lesson["id"], "reason": "mistake"}
        return None

    def new_lesson():
        if has("lesson"):
            return None
        fresh = [lesson for lesson in catalog if not lesson["progress"]]
        if not fresh:
            return None
        # Courses take turns day by day, in curriculum order inside a course.
        courses = sorted({lesson["course"] for lesson in fresh})
        course = courses[date.fromisoformat(today).toordinal() % len(courses)]
        lesson = next(lesson for lesson in fresh if lesson["course"] == course)
        return {"kind": "lesson", "id": lesson["id"], "reason": "new"}

    def new_story():
        if has("story"):
            return None
        # Easiest unread story first (the catalog is in level order).
        story = next((s for s in stories.catalog(db) if not (s["progress"] or {}).get("quiz_total")), None)
        return {"kind": "story", "id": story["id"]} if story else None

    # A new video lesson and a new story take turns as the day's last step.
    last = [new_lesson, new_story] if date.fromisoformat(today).toordinal() % 2 else [new_story, new_lesson]
    candidates = [
        lambda: work.pop(0) if work else None,
        mistake_lesson,
        lambda: {"kind": "mistakes", "count": min(MISTAKE_STEP, len(pending))} if pending and not has("mistakes") else None,
        lambda: work.pop(0) if work else None,
        *last,
    ]
    for make in candidates:
        if len(items) >= limit:
            break
        item = make()
        if item:
            items.append(_stored(item))
    return items


def _stored(item):
    if item["kind"] in ("test", "reading"):
        return {"kind": item["kind"], "id": item["id"]}
    if item["kind"] == "lesson":
        return {"kind": "lesson", "id": item["id"], "reason": item.get("reason", "new")}
    if item["kind"] == "story":
        return {"kind": "story", "id": item["id"]}
    return {"kind": "mistakes", "count": item["count"]}


def _detail(db, today, items):
    """Stored steps with what the page shows; steps whose work was deleted are left out."""
    catalog = {lesson["id"]: lesson for lesson in lessons.catalog(db)}
    result = []
    for item in items:
        kind = item["kind"]
        if kind == "test":
            row = db.execute("""SELECT a.id, a.title, a.due_date, a.submitted_at,
                (SELECT COUNT(*) FROM assignment_questions aq WHERE aq.assignment_id = a.id) AS total,
                (SELECT COUNT(*) FROM responses r WHERE r.assignment_id = a.id) AS answered
                FROM assignments a WHERE a.id = ?""", (item["id"],)).fetchone()
            if not row:
                continue
            result.append({**item, "title": row["title"], "dueDate": row["due_date"], "done": bool(row["submitted_at"]),
                           "answered": row["answered"], "total": row["total"]})
        elif kind == "reading":
            row = db.execute("""SELECT a.*, s.title AS reading_title,
                (SELECT COUNT(*) FROM reading_responses r WHERE r.assignment_id = a.id) AS answered
                FROM reading_assignments a JOIN reading_sections s ON s.id = a.section_id
                WHERE a.id = ?""", (item["id"],)).fetchone()
            if not row:
                continue
            result.append({**item, "title": row["title"], "dueDate": row["due_date"], "done": bool(row["submitted_at"]),
                           "answered": row["answered"], "total": len(reading_module.assigned_numbers(db, row))})
        elif kind == "lesson":
            lesson = catalog.get(item["id"])
            if not lesson:
                continue
            p = lesson["progress"] or {}
            result.append({**item, "title": lesson["title"], "course": lesson["course"],
                           "minutes": max(1, round((lesson["duration"] or 0) / 60)),
                           "done": database.local_date(p.get("completed_at")) == today,
                           "score": p.get("quiz_score"), "total": p.get("quiz_total")})
        elif kind == "story":
            story = next((s for s in stories.catalog(db) if s["id"] == item["id"]), None)
            if not story:
                continue
            p = story["progress"] or {}
            result.append({**item, "title": story["title"], "levelName": story["levelName"],
                           "minutes": max(3, round(story["words"] / 70) + 2),
                           "done": database.local_date(p.get("completed_at")) == today,
                           "score": p.get("quiz_score"), "total": p.get("quiz_total")})
        elif kind == "mistakes":
            solved = sum(1 for r in db.execute("SELECT resolved_at FROM mistake_resolutions")
                         if database.local_date(r[0]) == today)
            result.append({**item, "title": f"Hata defterinden {item['count']} soruyu yeniden dene",
                           "solved": min(solved, item["count"]), "done": solved >= item["count"]})
    return result


def today_plan(db):
    """Today's plan, made now if it is the first look today."""
    today = date.today().isoformat()
    row = db.execute("SELECT items, completed_at FROM daily_plans WHERE day = ?", (today,)).fetchone()
    if row and not json.loads(row[0]):
        # Nothing was left to do earlier today; look again for new work.
        items = _fill(db, today, [], size(db))
        completed_at = row[1]
        if items:
            db.execute("UPDATE daily_plans SET items = ? WHERE day = ?", (json.dumps(items), today))
    elif row:
        items = json.loads(row[0])
        completed_at = row[1]
        # Work given later with a target date of today or earlier joins the plan.
        added = [w for w in _open_work(db) if w["due_date"] and w["due_date"] <= today
                 and not any(i["kind"] == w["kind"] and i.get("id") == w["id"] for i in items)]
        if added:
            items += [_stored(w) for w in added]
            db.execute("UPDATE daily_plans SET items = ? WHERE day = ?", (json.dumps(items), today))
    else:
        items = _fill(db, today, [], size(db))
        completed_at = None
        db.execute("INSERT INTO daily_plans(day, items) VALUES (?, ?) ON CONFLICT(day) DO NOTHING",
                   (today, json.dumps(items)))
    steps = _detail(db, today, items)
    done = bool(steps) and all(s["done"] for s in steps)
    if done and not completed_at:
        db.execute("UPDATE daily_plans SET completed_at = CURRENT_TIMESTAMP WHERE day = ?", (today,))
    return {"day": today, "steps": steps, "done": sum(1 for s in steps if s["done"]), "total": len(steps),
            "complete": done, "size": size(db), "sizes": SIZES}


def completed_days(db):
    return db.execute("SELECT COUNT(*) FROM daily_plans WHERE completed_at IS NOT NULL").fetchone()[0]
