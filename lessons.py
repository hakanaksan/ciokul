"""Video lessons: narrated, animated lessons defined in lessons/<id>.json.

Each lesson file holds the curriculum outcome, the scenes with their sentences and a short
quiz; lessons/<id>.audio.json (made by generate_lesson_audio.py) holds the sentence timings.
The narration lives in lesson_audio/<id>/<scene>.wav (or in the file store).
"""

from __future__ import annotations

import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
LESSONS = BASE / "lessons"
AUDIO = BASE / "lesson_audio"
NAME = re.compile(r"[a-z0-9-]{1,40}")

SCHEMA_SQLITE = """
CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  watched INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER,
  quiz_total INTEGER,
  best_score INTEGER,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def _load(lesson_id):
    if not NAME.fullmatch(lesson_id or ""):
        return None
    path = LESSONS / f"{lesson_id}.json"
    if not path.is_file():
        return None
    lesson = json.loads(path.read_text(encoding="utf-8"))
    timing = LESSONS / f"{lesson_id}.audio.json"
    lesson["audio"] = json.loads(timing.read_text(encoding="utf-8")) if timing.is_file() else {"scenes": {}, "duration": 0}
    return lesson


def _progress(db):
    return {row["lesson_id"]: dict(row) for row in db.execute("SELECT * FROM lesson_progress")}


def catalog(db):
    progress = _progress(db)
    items = []
    for path in sorted(LESSONS.glob("*.json")):
        if path.name.endswith(".audio.json"):
            continue
        lesson = _load(path.stem)
        items.append({
            "id": lesson["id"], "title": lesson["title"], "course": lesson["course"], "unit": lesson["unit"],
            "kazanim": lesson["kazanim"], "summary": lesson["summary"], "match": lesson.get("match", {}),
            "scenes": len(lesson["scenes"]), "duration": lesson["audio"].get("duration", 0),
            "progress": progress.get(lesson["id"]),
        })
    return items


def detail(db, lesson_id):
    lesson = _load(lesson_id)
    if lesson:
        lesson["progress"] = _progress(db).get(lesson_id)
    return lesson


def save_progress(db, lesson_id, data):
    lesson = _load(lesson_id)
    if not lesson:
        raise ValueError("Video ders bulunamadı.")
    score, total = data.get("score"), data.get("total")
    if score is None:
        db.execute("""INSERT INTO lesson_progress(lesson_id, watched) VALUES (?, 1)
            ON CONFLICT(lesson_id) DO UPDATE SET watched = 1, updated_at = CURRENT_TIMESTAMP""", (lesson_id,))
        return
    if (type(score) is not int or type(total) is not int or total != len(lesson["quiz"])
            or not 0 <= score <= total):
        raise ValueError("Test sonucu geçersiz.")
    db.execute("""INSERT INTO lesson_progress(lesson_id, watched, quiz_score, quiz_total, best_score, completed_at)
        VALUES (?, 1, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(lesson_id) DO UPDATE SET watched = 1, quiz_score = excluded.quiz_score,
          quiz_total = excluded.quiz_total, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP,
          best_score = CASE WHEN lesson_progress.best_score IS NULL OR excluded.best_score > lesson_progress.best_score
                            THEN excluded.best_score ELSE lesson_progress.best_score END""",
               (lesson_id, score, total, score))


def audio_name(lesson_id, scene_file):
    """Logical store name for a scene's narration, or None when the request is not valid."""
    lesson = _load(lesson_id)
    match = re.fullmatch(r"(s\d{2})\.wav", scene_file or "")
    if not lesson or not match or match.group(1) not in {s["id"] for s in lesson["scenes"]}:
        return None
    return f"lesson_audio/{lesson_id}/{scene_file}"
