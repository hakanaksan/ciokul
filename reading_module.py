"""Database and HTTP operations for the local reading activities."""

from __future__ import annotations

import json
import re
import database
import storage
import study_features
from io import BytesIO
from pathlib import Path
from urllib.parse import parse_qs, urlparse

BASE = Path(__file__).resolve().parent
IMAGES = BASE / "reading_images"
MANIFEST = BASE / "4_sinif_okuma_becerileri" / "etkinlikler.json"
BOOK = MANIFEST.parent / "4_sinif_okuma_becerileri.pdf"
KEY = MANIFEST.parent / "4_sinif_okuma_becerileri_cevap_anahtari.pdf"
SKILLS = {"locate": "Metinden bilgi bulma", "inference": "Çıkarım yapma",
          "comment": "Yorumlama", "visual": "Tablo ve görsel okuma"}


def install(db):
    needs_skill_seed = False
    if not database.IS_POSTGRES:  # PostgreSQL tables come from schema_postgres.sql
        db.executescript("""
        CREATE TABLE IF NOT EXISTS reading_sections (
          id INTEGER PRIMARY KEY, title TEXT NOT NULL, pages_json TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS reading_questions (
          section_id INTEGER NOT NULL REFERENCES reading_sections(id),
          number INTEGER NOT NULL, page INTEGER NOT NULL, image TEXT NOT NULL,
          kind TEXT NOT NULL, prompt TEXT NOT NULL, answer_key TEXT NOT NULL,
          answer_image TEXT NOT NULL, max_score INTEGER NOT NULL DEFAULT 1,
          options_json TEXT NOT NULL DEFAULT '[]',
          answer_page INTEGER NOT NULL DEFAULT 0,
          skill TEXT NOT NULL DEFAULT 'locate',
          PRIMARY KEY(section_id,number));
        CREATE TABLE IF NOT EXISTS reading_assignments (
          id INTEGER PRIMARY KEY, section_id INTEGER NOT NULL REFERENCES reading_sections(id),
          title TEXT NOT NULL, due_date TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          submitted_at TEXT, last_question_index INTEGER NOT NULL DEFAULT 0,
          question_numbers_json TEXT);
        CREATE TABLE IF NOT EXISTS reading_responses (
          assignment_id INTEGER NOT NULL REFERENCES reading_assignments(id),
          number INTEGER NOT NULL, answer TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(assignment_id,number));
        CREATE TABLE IF NOT EXISTS reading_reviews (
          assignment_id INTEGER NOT NULL REFERENCES reading_assignments(id),
          number INTEGER NOT NULL, score INTEGER NOT NULL, note TEXT NOT NULL DEFAULT '',
          reviewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(assignment_id,number));
        CREATE TABLE IF NOT EXISTS reading_image_checks (
          section_id INTEGER NOT NULL, number INTEGER NOT NULL,
          side TEXT NOT NULL CHECK(side IN ('question','answer')),
          verified INTEGER NOT NULL DEFAULT 0, note TEXT NOT NULL DEFAULT '',
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(section_id,number,side));
        """)
        columns = {row[1] for row in db.execute("PRAGMA table_info(reading_questions)")}
        if "options_json" not in columns:
            db.execute("ALTER TABLE reading_questions ADD COLUMN options_json TEXT NOT NULL DEFAULT '[]'")
        if "answer_page" not in columns:
            db.execute("ALTER TABLE reading_questions ADD COLUMN answer_page INTEGER NOT NULL DEFAULT 0")
        needs_skill_seed = "skill" not in columns
        if needs_skill_seed:
            db.execute("ALTER TABLE reading_questions ADD COLUMN skill TEXT NOT NULL DEFAULT 'locate'")
        assignment_columns = {row[1] for row in db.execute("PRAGMA table_info(reading_assignments)")}
        if "question_numbers_json" not in assignment_columns:
            db.execute("ALTER TABLE reading_assignments ADD COLUMN question_numbers_json TEXT")
        resp_columns = {row[1] for row in db.execute("PRAGMA table_info(reading_responses)")}
        if "duration_seconds" not in resp_columns:
            db.execute("ALTER TABLE reading_responses ADD COLUMN duration_seconds INTEGER NOT NULL DEFAULT 0")
    if not MANIFEST.is_file():
        return
    sections = json.loads(MANIFEST.read_text(encoding="utf-8"))
    db.executemany("INSERT INTO reading_sections VALUES (?,?,?) ON CONFLICT DO NOTHING",
                   [(section["number"], section["title"], json.dumps(section["pages"])) for section in sections])
    db.executemany("""INSERT INTO reading_questions
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(section_id,number) DO UPDATE SET
        kind=excluded.kind,answer_key=excluded.answer_key,
        max_score=excluded.max_score,options_json=excluded.options_json,
        answer_page=excluded.answer_page""",
        [(section["number"], q["number"], q["page"], q["image"],
          q["kind"], q["prompt"], q["key"], q["answer_image"], q["max_score"],
          json.dumps(q.get("options", []), ensure_ascii=False), q.get("answer_page", 0),
          q.get("skill", "locate")) for section in sections for q in section["questions"]])
    if needs_skill_seed:
        db.executemany("UPDATE reading_questions SET skill=? WHERE section_id=? AND number=?",
                       [(q.get("skill", "locate"), section["number"], q["number"])
                        for section in sections for q in section["questions"]])


def rows(db, query, params=()):
    return [dict(item) for item in db.execute(query, params)]


def assignment(db, aid):
    result = db.execute("SELECT * FROM reading_assignments WHERE id=?", (aid,)).fetchone()
    if not result:
        raise ValueError("Okuma çalışması bulunamadı.")
    return result


def assigned_numbers(db, a):
    if a["question_numbers_json"]:
        return json.loads(a["question_numbers_json"])
    return [row[0] for row in db.execute(
        "SELECT number FROM reading_questions WHERE section_id=? ORDER BY number", (a["section_id"],))]


def answer_allowed(db, aid):
    a = assignment(db, aid)
    if a["submitted_at"]:
        raise ValueError("Teslim edilen çalışma değiştirilemez.")
    return a


def validate_written_answer(answer):
    if len(answer) > 8000:
        raise ValueError("Yanıt çok uzun.")
    if not answer.startswith("{"):
        return
    try:
        value = json.loads(answer)
    except json.JSONDecodeError:
        return
    if not isinstance(value, dict) or value.get("format") != "annotated-v1":
        return
    text = value.get("text")
    marks = value.get("marks")
    if not isinstance(text, str) or len(text) > 4000 or not isinstance(marks, list) or len(marks) > 30:
        raise ValueError("Görsel yanıtı geçersiz.")
    if not text.strip() and not marks:
        raise ValueError("Boş yanıt kaydedilemez.")
    for mark in marks:
        if (not isinstance(mark, dict) or mark.get("type") not in ("text", "check")
                or type(mark.get("x")) not in (int, float) or type(mark.get("y")) not in (int, float)
                or not 0 <= mark["x"] <= 1 or not 0 <= mark["y"] <= 1
                or not isinstance(mark.get("value"), str) or len(mark["value"]) > 80):
            raise ValueError("Görsel işareti geçersiz.")


def reading_question(db, section_id, number):
    result = db.execute("SELECT * FROM reading_questions WHERE section_id=? AND number=?",
                        (section_id, number)).fetchone()
    if not result:
        raise ValueError("Okuma sorusu bulunamadı.")
    return result


def source_page(pdf_path, page_number):
    import pypdfium2
    readable = storage.local_file(pdf_path.relative_to(BASE).as_posix(), pdf_path)
    if readable is None:
        raise ValueError("Kaynak PDF bulunamadı.")
    with pypdfium2.PdfDocument(str(readable)) as document:
        if not 1 <= page_number <= len(document):
            raise ValueError("Kaynak PDF sayfası bulunamadı.")
        return document[page_number - 1].render(scale=2).to_pil().convert("RGB")


def handle(h, method, path, data, connect, lock, checked_date):
    if path.startswith("/reading-images/") and method == "GET":
        if not h.require(): return True
        name = path.removeprefix("/reading-images/")
        if not re.fullmatch(r"R\d{2}_[PQA]\d{2}\.png", name):
            h.send_json({"error": "Geçersiz görsel."}, 400); return True
        with connect() as db:
            if h.role() == "parent":
                allowed = db.execute("""SELECT 1 FROM reading_questions WHERE image=? OR answer_image=?
                    UNION SELECT 1 FROM reading_sections WHERE pages_json LIKE ? LIMIT 1""",
                    (name, name, f'%"{name}"%')).fetchone()
            elif "_A" in name:
                allowed = None
            else:
                allowed = db.execute("""SELECT 1 FROM reading_assignments a
                    JOIN reading_sections s ON s.id=a.section_id
                    LEFT JOIN reading_questions q ON q.section_id=s.id
                    WHERE q.image=? OR (s.pages_json LIKE ? AND a.id IS NOT NULL) LIMIT 1""",
                    (name, f'%"{name}"%')).fetchone()
        payload = storage.read(f"reading_images/{name}", IMAGES / name) if allowed else None
        if payload is None: h.send_json({"error": "Görsel bulunamadı."}, 404)
        else: h.send_file(payload, "image/png")
        return True
    if not path.startswith("/api/reading"):
        return False
    if not h.require(): return True
    parts = path.strip("/").split("/")
    if method == "GET" and parts == ["api", "reading", "catalog"]:
        if not h.require("parent"): return True
        with connect() as db:
            result = rows(db, """SELECT s.id,s.title,COUNT(q.number) AS total
                FROM reading_sections s JOIN reading_questions q ON q.section_id=s.id
                GROUP BY s.id ORDER BY s.id""")
        h.send_json({"sections": result}); return True
    if method == "GET" and parts == ["api", "reading", "audit"]:
        if not h.require("parent"): return True
        section_id = int(parse_qs(urlparse(h.path).query).get("sectionId", ["1"])[0])
        with connect() as db:
            result = rows(db, """SELECT q.section_id,q.number,q.page,q.answer_page,q.image,q.answer_image,
                q.skill, c.verified AS question_verified,c.note AS question_note,
                k.verified AS answer_verified,k.note AS answer_note,
                EXISTS(SELECT 1 FROM reading_responses r JOIN reading_assignments a ON a.id=r.assignment_id
                  WHERE a.section_id=q.section_id AND r.number=q.number) AS has_responses
                FROM reading_questions q
                LEFT JOIN reading_image_checks c ON c.section_id=q.section_id AND c.number=q.number AND c.side='question'
                LEFT JOIN reading_image_checks k ON k.section_id=q.section_id AND k.number=q.number AND k.side='answer'
                WHERE q.section_id=? ORDER BY q.number""", (section_id,))
        h.send_json({"questions": result, "skills": SKILLS}); return True
    if method == "GET" and parts == ["api", "reading", "progress"]:
        if not h.require("parent"): return True
        with connect() as db:
            attempts = rows(db, """SELECT a.id,a.title,a.submitted_at,s.title AS reading_title,
                COUNT(v.number) AS reviewed,COALESCE(SUM(v.score),0) AS earned,
                COALESCE(SUM(CASE WHEN v.number IS NOT NULL THEN q.max_score ELSE 0 END),0) AS possible
                FROM reading_assignments a JOIN reading_sections s ON s.id=a.section_id
                 JOIN reading_questions q ON q.section_id=a.section_id AND
                 (a.question_numbers_json IS NULL OR EXISTS
                   (SELECT 1 FROM json_each(a.question_numbers_json) j WHERE CAST(j.value AS INTEGER)=q.number))
                LEFT JOIN reading_reviews v ON v.assignment_id=a.id AND v.number=q.number
                GROUP BY a.id,s.title ORDER BY a.id DESC""")
            skills = rows(db, """SELECT q.skill,COUNT(*) AS reviewed,SUM(v.score) AS earned,
                SUM(q.max_score) AS possible FROM reading_reviews v
                JOIN reading_assignments a ON a.id=v.assignment_id
                JOIN reading_questions q ON q.section_id=a.section_id AND q.number=v.number
                GROUP BY q.skill ORDER BY q.skill""")
        h.send_json({"attempts": attempts, "skills": skills, "skillNames": SKILLS}); return True
    if method == "GET" and len(parts) == 6 and parts[:3] == ["api", "reading", "questions"] and parts[5] == "page":
        if not h.require("parent"): return True
        section_id, number = int(parts[3]), int(parts[4])
        side = parse_qs(urlparse(h.path).query).get("side", ["question"])[0]
        if side not in ("question", "answer"): raise ValueError("Görsel türü geçersiz.")
        with connect() as db:
            q = reading_question(db, section_id, number)
            page_number = q["page"] if side == "question" else q["answer_page"]
        image = source_page(BOOK if side == "question" else KEY, page_number)
        stream = BytesIO(); image.save(stream, format="PNG", optimize=True)
        h.send_file(stream.getvalue(), "image/png"); return True
    if method == "PUT" and len(parts) == 6 and parts[:3] == ["api", "reading", "questions"]:
        if not h.require("parent"): return True
        section_id, number, action = int(parts[3]), int(parts[4]), parts[5]
        with lock, connect() as db:
            q = reading_question(db, section_id, number)
            if action == "audit":
                side, verified, note = data.get("side"), data.get("verified"), data.get("note", "")
                if side not in ("question", "answer") or type(verified) is not bool or not isinstance(note, str) or len(note) > 500:
                    raise ValueError("Görsel denetimi geçersiz.")
                db.execute("""INSERT INTO reading_image_checks(section_id,number,side,verified,note)
                    VALUES (?,?,?,?,?) ON CONFLICT(section_id,number,side) DO UPDATE SET
                    verified=excluded.verified,note=excluded.note,updated_at=CURRENT_TIMESTAMP""",
                    (section_id, number, side, int(verified), note.strip()))
            elif action == "skill":
                skill = data.get("skill")
                if skill not in SKILLS: raise ValueError("Beceri etiketi geçersiz.")
                db.execute("UPDATE reading_questions SET skill=? WHERE section_id=? AND number=?",
                           (skill, section_id, number))
            elif action == "crop":
                side, box = data.get("side"), data.get("box")
                if side not in ("question", "answer") or not isinstance(box, list) or len(box) != 4 or any(type(x) not in (int,float) for x in box):
                    raise ValueError("Kesim alanı geçersiz.")
                left, top, right, bottom = box
                if not (0 <= left < right <= 1 and 0 <= top < bottom <= 1 and right-left >= .02 and bottom-top >= .02):
                    raise ValueError("Kesim alanı çok küçük veya geçersiz.")
                if side == "question" and db.execute("""SELECT 1 FROM reading_responses r JOIN reading_assignments a ON a.id=r.assignment_id
                    WHERE a.section_id=? AND r.number=? LIMIT 1""", (section_id, number)).fetchone():
                    raise ValueError("Bu sorunun öğrenci yanıtı var. Görsel kesimi değiştirilemez.")
                image = source_page(BOOK if side == "question" else KEY,
                                    q["page"] if side == "question" else q["answer_page"])
                crop = image.crop((round(left*image.width), round(top*image.height),
                                   round(right*image.width), round(bottom*image.height)))
                filename = q["image"] if side == "question" else q["answer_image"]
                if not re.fullmatch(r"R\d{2}_[QA]\d{2}\.png", filename):
                    raise ValueError("Görsel dosyası geçersiz.")
                stream = BytesIO()
                crop.save(stream, format="PNG", optimize=True)
                storage.write(f"reading_images/{filename}", IMAGES / filename, stream.getvalue())
                db.execute("""INSERT INTO reading_image_checks(section_id,number,side,verified,note)
                    VALUES (?,?,?,1,'') ON CONFLICT(section_id,number,side) DO UPDATE SET
                    verified=1,note='',updated_at=CURRENT_TIMESTAMP""", (section_id, number, side))
            else:
                raise ValueError("Bilinmeyen görsel işlemi.")
        h.send_json({"ok": True}); return True
    if method == "GET" and parts == ["api", "reading", "assignments"]:
        with connect() as db:
            result = rows(db, """SELECT a.*,s.title AS reading_title,
                 (SELECT COUNT(*) FROM reading_questions q WHERE q.section_id=a.section_id AND
                   (a.question_numbers_json IS NULL OR EXISTS
                    (SELECT 1 FROM json_each(a.question_numbers_json) j WHERE CAST(j.value AS INTEGER)=q.number))) AS total,
                (SELECT COUNT(*) FROM reading_responses r WHERE r.assignment_id=a.id) AS answered,
                (SELECT COUNT(*) FROM reading_reviews v WHERE v.assignment_id=a.id) AS reviewed
                FROM reading_assignments a JOIN reading_sections s ON s.id=a.section_id
                ORDER BY a.id DESC""")
        h.send_json({"assignments": result}); return True
    if method == "GET" and len(parts) == 4 and parts[:3] == ["api", "reading", "assignments"]:
        aid = int(parts[3])
        with connect() as db:
            a = assignment(db, aid)
            section = db.execute("SELECT * FROM reading_sections WHERE id=?", (a["section_id"],)).fetchone()
            questions = rows(db, """SELECT q.*,r.answer AS response,COALESCE(r.duration_seconds, 0) AS duration_seconds,v.score,v.note
                FROM reading_questions q
                LEFT JOIN reading_responses r ON r.assignment_id=? AND r.number=q.number
                LEFT JOIN reading_reviews v ON v.assignment_id=? AND v.number=q.number
                WHERE q.section_id=? ORDER BY q.number""", (aid, aid, a["section_id"]))
            selected = set(assigned_numbers(db, a))
            questions = [q for q in questions if q["number"] in selected]
            for q in questions:
                reflection = db.execute("""SELECT uncertain,reason FROM study_reflections
                    WHERE kind='reading' AND assignment_id=? AND item_key=?""",
                    (aid, study_features.item_key("reading", a["section_id"], q["number"]))).fetchone()
                q["uncertain"] = bool(reflection["uncertain"]) if reflection else False
                q["reason"] = reflection["reason"] if reflection else ""
            ready = bool(a["submitted_at"]) and all(q["score"] is not None for q in questions)
            for q in questions:
                q["options"] = json.loads(q.pop("options_json"))
            if h.role() != "parent":
                for q in questions:
                    q.pop("answer_image")
                    q.pop("reason")
                    if not ready:
                        q.pop("answer_key")
                        q.pop("score")
                        q.pop("note")
        h.send_json({"assignment": dict(a), "readingTitle": section["title"],
                     "pages": json.loads(section["pages_json"]), "questions": questions,
                     "feedbackReady": ready}); return True
    if method == "POST" and parts == ["api", "reading", "assignments"]:
        if not h.require("parent"): return True
        section_id, title = data.get("sectionId"), str(data.get("title", "")).strip()
        due = checked_date(data.get("dueDate"))
        numbers = data.get("numbers")
        if type(section_id) is not int or not title or len(title) > 100:
            raise ValueError("Metin ve çalışma adı gerekli.")
        with lock, connect() as db:
            if not db.execute("SELECT 1 FROM reading_sections WHERE id=?", (section_id,)).fetchone():
                raise ValueError("Okuma metni bulunamadı.")
            if numbers is not None:
                valid = {row[0] for row in db.execute("SELECT number FROM reading_questions WHERE section_id=?", (section_id,))}
                if (not isinstance(numbers, list) or not numbers or len(numbers) > 15 or
                    any(type(n) is not int or n not in valid for n in numbers) or len(set(numbers)) != len(numbers)):
                    raise ValueError("Tekrar çalışması için 1–15 soru seçin.")
            new_id = db.execute("""INSERT INTO reading_assignments(section_id,title,due_date,question_numbers_json)
                VALUES (?,?,?,?) RETURNING id""",
                (section_id, title, due, json.dumps(sorted(numbers)) if numbers is not None else None)).fetchone()[0]
            if data.get("fromRepeatQueue") is True:
                study_features.mark_dispatched(db, "reading", new_id,
                                               [study_features.item_key("reading", section_id, n) for n in (numbers or [])])
        h.send_json({"id": new_id}, 201); return True
    if len(parts) < 4 or parts[:3] != ["api", "reading", "assignments"]:
        raise ValueError("Bilinmeyen okuma işlemi.")
    aid = int(parts[3])
    if method == "PUT" and len(parts) == 4:
        if not h.require("parent"): return True
        title = data.get("title")
        due = checked_date(data.get("dueDate")) if "dueDate" in data else None
        if title is not None and (not isinstance(title, str) or not title.strip() or len(title.strip()) > 100):
            raise ValueError("Çalışma adı geçersiz.")
        with lock, connect() as db:
            assignment(db, aid)
            if title is not None: db.execute("UPDATE reading_assignments SET title=? WHERE id=?", (title.strip(), aid))
            if "dueDate" in data: db.execute("UPDATE reading_assignments SET due_date=? WHERE id=?", (due, aid))
        h.send_json({"ok": True}); return True
    if method == "DELETE" and len(parts) == 4:
        if not h.require("parent"): return True
        with lock, connect() as db:
            assignment(db, aid)
            study_features.delete_assignment(db, "reading", aid)
            db.execute("DELETE FROM reading_reviews WHERE assignment_id=?", (aid,))
            db.execute("DELETE FROM reading_responses WHERE assignment_id=?", (aid,))
            db.execute("DELETE FROM reading_assignments WHERE id=?", (aid,))
        h.send_json({"ok": True}); return True
    if method == "PUT" and len(parts) == 5 and parts[4] == "progress":
        if not h.require("student"): return True
        index = data.get("index")
        with lock, connect() as db:
            a = answer_allowed(db, aid)
            count = len(assigned_numbers(db, a))
            if type(index) is not int or not 0 <= index < count: raise ValueError("Soru sırası geçersiz.")
            db.execute("UPDATE reading_assignments SET last_question_index=? WHERE id=?", (index, aid))
        h.send_json({"ok": True}); return True
    if method in ("PUT", "DELETE") and len(parts) == 6 and parts[4] == "answers":
        if not h.require("student"): return True
        number = int(parts[5])
        with lock, connect() as db:
            a = answer_allowed(db, aid)
            if number not in assigned_numbers(db, a): raise ValueError("Soru bu çalışmaya ait değil.")
            q = db.execute("SELECT kind,options_json FROM reading_questions WHERE section_id=? AND number=?",
                           (a["section_id"], number)).fetchone()
            if not q: raise ValueError("Soru bulunamadı.")
            if method == "DELETE":
                db.execute("DELETE FROM reading_responses WHERE assignment_id=? AND number=?", (aid, number))
            else:
                answer = str(data.get("answer", "")).strip()
                valid_multi = True
                if q["kind"] == "multi":
                    options = json.loads(q["options_json"])
                    selected = answer.split(",")
                    valid_multi = bool(selected) and selected == sorted(set(selected), key=int) and all(
                        item.isdigit() and 1 <= int(item) <= len(options) for item in selected)
                if not answer or (q["kind"] != "written" and len(answer) > 4000) or (q["kind"] == "choice" and answer not in "ABCD") or not valid_multi:
                    raise ValueError("Yanıt geçersiz.")
                if q["kind"] == "written":
                    validate_written_answer(answer)
                duration = max(int(data.get("durationSeconds", 0)), 0)
                db.execute("""INSERT INTO reading_responses(assignment_id,number,answer,duration_seconds) VALUES (?,?,?,?)
                    ON CONFLICT(assignment_id,number) DO UPDATE SET
                    answer=excluded.answer,
                    duration_seconds=reading_responses.duration_seconds + excluded.duration_seconds,
                    updated_at=CURRENT_TIMESTAMP""", (aid, number, answer, duration))
        h.send_json({"ok": True}); return True
    if method == "POST" and len(parts) == 5 and parts[4] == "submit":
        if not h.require("student"): return True
        with lock, connect() as db:
            a = answer_allowed(db, aid)
            total = len(assigned_numbers(db, a))
            answered = db.execute("SELECT COUNT(*) FROM reading_responses WHERE assignment_id=?", (aid,)).fetchone()[0]
            if answered != total: raise ValueError("Tüm soruları yanıtlayın.")
            db.execute("UPDATE reading_assignments SET submitted_at=CURRENT_TIMESTAMP WHERE id=?", (aid,))
        h.send_json({"ok": True}); return True
    if method == "POST" and len(parts) == 5 and parts[4] == "reviews":
        if not h.require("parent"): return True
        reviews = data.get("reviews")
        with lock, connect() as db:
            a = assignment(db, aid)
            if not a["submitted_at"]: raise ValueError("Öğrenci henüz teslim etmedi.")
            selected = set(assigned_numbers(db, a))
            questions = {q["number"]: q["max_score"] for q in db.execute(
                "SELECT number,max_score FROM reading_questions WHERE section_id=?", (a["section_id"],)) if q["number"] in selected}
            if not isinstance(reviews, list) or len(reviews) != len(questions):
                raise ValueError("Tüm soruları birlikte değerlendirin.")
            seen = set()
            for item in reviews:
                if not isinstance(item, dict) or type(item.get("number")) is not int:
                    raise ValueError("Değerlendirme geçersiz.")
                number, score = item["number"], item.get("score")
                if number in seen or number not in questions or type(score) is not int or not 0 <= score <= questions[number]:
                    raise ValueError("Puan geçersiz.")
                note = item.get("note", "")
                if not isinstance(note, str) or len(note) > 500: raise ValueError("Not geçersiz.")
                seen.add(number)
            previous = {r["number"]:r["score"] for r in db.execute(
                "SELECT number,score FROM reading_reviews WHERE assignment_id=?", (aid,))}
            db.executemany("""INSERT INTO reading_reviews(assignment_id,number,score,note) VALUES (?,?,?,?)
                ON CONFLICT(assignment_id,number) DO UPDATE SET score=excluded.score,
                note=excluded.note,reviewed_at=CURRENT_TIMESTAMP
                WHERE reading_reviews.score<>excluded.score OR reading_reviews.note<>excluded.note""",
                [(aid, r["number"], r["score"], r.get("note", "").strip()) for r in reviews])
            for r in reviews:
                key = study_features.item_key("reading", a["section_id"], r["number"])
                study_features.set_reason(db, "reading", aid, key, r.get("reason", ""))
                if previous.get(r["number"]) != r["score"]:
                    study_features.record_review(db, "reading", aid, key, r["score"] == questions[r["number"]])
        h.send_json({"ok": True, "saved": len(reviews)}); return True
    raise ValueError("Bilinmeyen okuma işlemi.")
