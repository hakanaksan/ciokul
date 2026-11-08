"""Hikâye Kitaplığı: original reading stories in stories/<id>.json with a closing comprehension quiz.

A story has pages of paragraphs (one sentence per item, so the narration can highlight the sentence
being read) and six multiple-choice questions, each tagged with a reading skill. stories/<id>.audio.json
(made by generate_story_audio.py) holds the sentence timings; the narration lives in
story_audio/<id>/<page>.wav (or in the file store). Quizzes are scored in the browser and saved here.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
STORIES = BASE / "stories"
NAME = re.compile(r"[a-z0-9-]{1,40}")
LEVELS = {1: "Kolay", 2: "Orta", 3: "Zor"}
SKILLS = {"locate": "Metinden bilgi bulma", "inference": "Çıkarım yapma",
          "comment": "Yorumlama", "vocab": "Kelime anlamı"}

SCHEMA_SQLITE = """
CREATE TABLE IF NOT EXISTS story_progress (
  story_id TEXT PRIMARY KEY,
  opened INTEGER NOT NULL DEFAULT 0,
  quiz_score INTEGER,
  quiz_total INTEGER,
  best_score INTEGER,
  answers TEXT,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


def _load(story_id):
    if not NAME.fullmatch(story_id or ""):
        return None
    path = STORIES / f"{story_id}.json"
    if not path.is_file():
        return None
    story = json.loads(path.read_text(encoding="utf-8"))
    timing = STORIES / f"{story_id}.audio.json"
    story["audio"] = json.loads(timing.read_text(encoding="utf-8")) if timing.is_file() else {"pages": {}, "duration": 0}
    return story


def _ids():
    return sorted(p.stem for p in STORIES.glob("*.json") if not p.name.endswith(".audio.json"))


def _progress(db):
    return {row["story_id"]: dict(row) for row in db.execute("SELECT * FROM story_progress")}


def words(story):
    return sum(len(sentence.split()) for page in story["pages"] for paragraph in page["paragraphs"]
               for sentence in paragraph)


def catalog(db):
    progress = _progress(db)
    items = []
    for story_id in _ids():
        story = _load(story_id)
        p = progress.get(story_id)
        if p:
            p.pop("answers", None)
        items.append({
            "id": story["id"], "title": story["title"], "theme": story["theme"], "level": story["level"],
            "levelName": LEVELS.get(story["level"], ""), "summary": story["summary"], "icon": story["icon"],
            "color": story["color"], "cover": story["cover"], "pages": len(story["pages"]), "words": words(story),
            "questions": len(story["questions"]), "duration": story["audio"].get("duration", 0), "progress": p,
        })
    # Easier stories first; inside a level, by title.
    return sorted(items, key=lambda item: (item["level"], item["title"]))


def detail(db, story_id):
    story = _load(story_id)
    if story:
        p = _progress(db).get(story_id)
        if p:
            p.pop("answers", None)
        story["progress"] = p
        story["skills"] = SKILLS
        story["levelName"] = LEVELS.get(story["level"], "")
    return story


def save_progress(db, story_id, data):
    story = _load(story_id)
    if not story:
        raise ValueError("Hikâye bulunamadı.")
    answers = data.get("answers")
    if answers is None:
        db.execute("""INSERT INTO story_progress(story_id, opened) VALUES (?, 1)
            ON CONFLICT(story_id) DO UPDATE SET opened = 1, updated_at = CURRENT_TIMESTAMP""", (story_id,))
        return None
    questions = story["questions"]
    if (not isinstance(answers, list) or len(answers) != len(questions)
            or not all(type(a) is int and 0 <= a < len(q["options"]) for a, q in zip(answers, questions))):
        raise ValueError("Cevaplar geçersiz.")
    # The score is counted here from the answers, so the browser cannot report a wrong total.
    score, total = sum(1 for a, q in zip(answers, questions) if a == q["answer"]), len(questions)
    db.execute("""INSERT INTO story_progress(story_id, opened, quiz_score, quiz_total, best_score, answers, completed_at)
        VALUES (?, 1, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(story_id) DO UPDATE SET opened = 1, quiz_score = excluded.quiz_score, quiz_total = excluded.quiz_total,
          answers = excluded.answers, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP,
          best_score = CASE WHEN story_progress.best_score IS NULL OR excluded.best_score > story_progress.best_score
                            THEN excluded.best_score ELSE story_progress.best_score END""",
               (story_id, score, total, score, json.dumps(answers)))
    return {"score": score, "total": total}


def results(db):
    """Finished story quizzes and reading skills (latest attempt of each story) for the parent."""
    progress = _progress(db)
    finished, skills = [], {key: {"name": name, "correct": 0, "total": 0} for key, name in SKILLS.items()}
    for story_id in _ids():
        p = progress.get(story_id)
        if not p or not p["quiz_total"]:
            continue
        story = _load(story_id)
        finished.append({"id": story_id, "title": story["title"], "level": story["level"],
                         "score": p["quiz_score"], "best": p["best_score"], "total": p["quiz_total"],
                         "completedAt": p["completed_at"]})
        try:
            answers = json.loads(p["answers"] or "[]")
        except ValueError:
            answers = []
        for answer, question in zip(answers, story["questions"]):
            skill = skills.get(question["skill"])
            if skill:
                skill["total"] += 1
                skill["correct"] += answer == question["answer"]
    return {"stories": finished, "skills": [dict(key=k, **v) for k, v in skills.items() if v["total"]]}


def audio_name(story_id, page_file):
    """Logical store name for a page's narration, or None when the request is not valid."""
    story = _load(story_id)
    match = re.fullmatch(r"(p\d{2})\.wav", page_file or "")
    if not story or not match or match.group(1) not in {p["id"] for p in story["pages"]}:
        return None
    return f"story_audio/{story_id}/{page_file}"
