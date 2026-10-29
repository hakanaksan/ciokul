"""Student badges: tiered achievements computed from the work already in the database.

Each badge has one to three goals (Bronz, Gümüş, Altın). Every reached goal gives stars;
stars add up to a level. Which tiers the student has already celebrated is kept in
settings['badges_seen'] so a new tier is announced once, on any device.
"""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import date, timedelta

import database
import reading_module

TIER_NAMES = ("Bronz", "Gümüş", "Altın")
CATEGORIES = {
    "habit": "Çalışma alışkanlığı",
    "success": "Başarı",
    "courses": "Dersler",
    "reading": "Okuma",
    "growth": "Gelişim",
}
COURSES = {
    "course_math": "Matematik",
    "course_science": "Fen Bilimleri",
    "course_turkish": "Türkçe",
    "course_social": "Sosyal Bilgiler",
    "course_english": "İngilizce",
    "course_religion": "Din Kültürü ve Ahlak Bilgisi",
}
# (category, id, icon, title, description with {goal}, goals)
BADGES = [
    ("habit", "first_step", "🌟", "İlk Adım", "İlk çalışmanı teslim et.", (1,)),
    ("habit", "hard_worker", "🐝", "Çalışkan Arı", "{goal} çalışma teslim et.", (5, 15, 30)),
    ("habit", "streak", "🔥", "Ateşli Seri", "Art arda {goal} gün çalışma teslim et.", (3, 7, 14)),
    ("habit", "week_star", "📅", "Haftanın Yıldızı", "Aynı hafta içinde {goal} çalışma teslim et.", (3, 5, 7)),
    ("habit", "on_time", "🎯", "Hedefi Tutturan", "{goal} çalışmayı hedef tarihinde ya da daha önce teslim et.", (1, 5, 15)),
    ("habit", "early_bird", "🐦", "Erken Kuş", "{goal} çalışmayı hedef tarihten en az bir gün önce teslim et.", (1, 5, 10)),
    ("habit", "weekend", "🏖️", "Hafta Sonu Kahramanı", "Hafta sonu {goal} çalışma teslim et.", (1, 5, 10)),
    ("success", "perfect", "💯", "Yıldız Başarı", "{goal} testin bütün sorularını doğru yap.", (1, 3, 10)),
    ("success", "sharpshooter", "🏹", "Keskin Nişancı", "{goal} testte soruların en az %80'ini doğru yap.", (1, 5, 15)),
    ("success", "correct_hunter", "✅", "Doğru Cevap Avcısı", "Toplam {goal} soruyu doğru yanıtla.", (25, 100, 300)),
    ("success", "patient", "🐢", "Sabırlı Düşünür", "{goal} soruda en az 2 dakika düşünüp doğru yanıtla.", (1, 5, 15)),
    ("success", "comeback", "💪", "Hatasından Öğrenen", "Önce yanlış yaptığın {goal} soruyu sonra doğru yap.", (1, 5, 15)),
    ("courses", "course_math", "📐", "Matematik Kaşifi", "{goal} Matematik testi tamamla.", (1, 3, 6)),
    ("courses", "course_science", "🔬", "Genç Bilim İnsanı", "{goal} Fen Bilimleri testi tamamla.", (1, 3, 6)),
    ("courses", "course_turkish", "✏️", "Kelime Ustası", "{goal} Türkçe testi tamamla.", (1, 3, 6)),
    ("courses", "course_social", "🌍", "Gezgin Tarihçi", "{goal} Sosyal Bilgiler testi tamamla.", (1, 3, 6)),
    ("courses", "course_english", "🗣️", "İngilizce Yıldızı", "{goal} İngilizce testi tamamla.", (1, 3, 6)),
    ("courses", "course_religion", "🕊️", "Değerler Elçisi", "{goal} Din Kültürü testi tamamla.", (1, 3, 6)),
    ("courses", "all_rounder", "🎨", "Çok Yönlü", "{goal} farklı dersten test tamamla.", (3, 6)),
    ("reading", "bookworm", "📖", "Kitap Kurdu", "{goal} okuma çalışması tamamla.", (1, 5, 10)),
    ("reading", "reading_master", "🏅", "Okuma Ustası", "{goal} okuma çalışmasından tam puan al.", (1, 3, 5)),
    ("growth", "mistake_hunter", "🛡️", "Hata Avcısı", "Hata defterinden {goal} soruyu çözüldü olarak işaretle.", (1, 10, 25)),
    ("growth", "honest", "🤔", "Dürüst Düşünür", "{goal} soruda “Bu sorudan emin değilim” işaretini kullan.", (1, 5, 15)),
    ("growth", "lesson_explorer", "🎬", "Video Dersi Kâşifi", "{goal} video dersi izleyip mini testini çöz.", (1, 3, 5)),
]
LEVELS = [(0, "Çırak"), (5, "Meraklı"), (12, "Kaşif"), (22, "Bilgin"), (35, "Usta"),
          (55, "Uzman"), (80, "Şampiyon"), (110, "Efsane")]


def _days(stamps):
    """Local calendar days of UTC timestamps, as dates."""
    return [date.fromisoformat(day) for day in (database.local_date(s) for s in stamps) if day]


def _streaks(days):
    """(best, current) runs of consecutive days; current counts only if it reaches today or yesterday."""
    ordered = sorted(set(days))
    best = run = 0
    previous = None
    for day in ordered:
        run = run + 1 if previous and day - previous == timedelta(days=1) else 1
        best = max(best, run)
        previous = day
    current = run if previous and (date.today() - previous).days <= 1 else 0
    return best, current


def _values(db):
    """Counts each badge is measured by."""
    submitted = [dict(r) for r in db.execute(
        "SELECT id, submitted_at, due_date FROM assignments WHERE submitted_at IS NOT NULL")]
    reading = [dict(r) for r in db.execute(
        "SELECT * FROM reading_assignments WHERE submitted_at IS NOT NULL")]
    work = submitted + reading
    days = _days(w["submitted_at"] for w in work)
    best_streak, current_streak = _streaks(days)
    weeks = defaultdict(int)
    for day in days:
        weeks[day.isocalendar()[:2]] += 1

    def due_gap(w):
        submitted_day = database.local_date(w["submitted_at"])
        return (date.fromisoformat(w["due_date"]) - date.fromisoformat(submitted_day)).days if (
            w["due_date"] and submitted_day) else None

    gaps = [g for g in (due_gap(w) for w in work) if g is not None]

    course_tests = defaultdict(int)
    for row in db.execute("""SELECT DISTINCT a.id, b.course FROM assignments a
            JOIN assignment_questions aq ON aq.assignment_id = a.id
            JOIN questions q ON q.id = aq.question_id
            JOIN booklets b ON b.id = q.booklet_id
            WHERE a.submitted_at IS NOT NULL"""):
        course_tests[row[1]] += 1

    tests = db.execute("""SELECT a.id, COUNT(aq.question_id) AS total, COUNT(r.question_id) AS reviewed,
            SUM(CASE WHEN r.grade = 'correct' THEN 1 ELSE 0 END) AS correct
            FROM assignments a JOIN assignment_questions aq ON aq.assignment_id = a.id
            LEFT JOIN reviews r ON r.assignment_id = a.id AND r.question_id = aq.question_id
            WHERE a.submitted_at IS NOT NULL GROUP BY a.id""").fetchall()
    graded = [t for t in tests if t["total"] and t["reviewed"] == t["total"]]

    full_reading_answers = """FROM reading_reviews v JOIN reading_assignments a ON a.id = v.assignment_id
            JOIN reading_questions q ON q.section_id = a.section_id AND q.number = v.number
            WHERE v.score = q.max_score"""
    correct_total = (db.execute("SELECT COUNT(*) FROM reviews WHERE grade = 'correct'").fetchone()[0]
                     + db.execute(f"SELECT COUNT(*) {full_reading_answers}").fetchone()[0])
    patient = (db.execute("""SELECT COUNT(*) FROM responses r JOIN reviews v
                ON v.assignment_id = r.assignment_id AND v.question_id = r.question_id
                WHERE r.duration_seconds >= 120 AND v.grade = 'correct'""").fetchone()[0]
               + db.execute(f"""SELECT COUNT(*) {full_reading_answers} AND EXISTS (
                SELECT 1 FROM reading_responses r WHERE r.assignment_id = v.assignment_id
                AND r.number = v.number AND r.duration_seconds >= 120)""").fetchone()[0])

    # A question counts once when a correct review follows an incorrect or partial one.
    history = [(f"t{r[0]}", r[1] == "correct") for r in db.execute(
        """SELECT v.question_id, v.grade FROM reviews v JOIN assignments a ON a.id = v.assignment_id
           ORDER BY a.submitted_at, a.id""")]
    history += [(f"r{r[0]}:{r[1]}", r[2] == r[3]) for r in db.execute(
        """SELECT a.section_id, v.number, v.score, q.max_score FROM reading_reviews v
           JOIN reading_assignments a ON a.id = v.assignment_id
           JOIN reading_questions q ON q.section_id = a.section_id AND q.number = v.number
           ORDER BY a.submitted_at, a.id""")]
    missed, recovered = set(), set()
    for key, success in history:
        if not success:
            missed.add(key)
        elif key in missed:
            recovered.add(key)

    scores = {r[0]: (r[1], r[2], r[3]) for r in db.execute(
        """SELECT v.assignment_id, COUNT(*), SUM(v.score), SUM(q.max_score) FROM reading_reviews v
           JOIN reading_assignments a ON a.id = v.assignment_id
           JOIN reading_questions q ON q.section_id = a.section_id AND q.number = v.number
           GROUP BY v.assignment_id""")}
    reading_full = sum(1 for a in reading if a["id"] in scores
                       and scores[a["id"]][0] == len(reading_module.assigned_numbers(db, a))
                       and scores[a["id"]][1] == scores[a["id"]][2])

    values = {
        "first_step": len(work),
        "hard_worker": len(work),
        "streak": best_streak,
        "week_star": max(weeks.values(), default=0),
        "on_time": sum(1 for g in gaps if g >= 0),
        "early_bird": sum(1 for g in gaps if g >= 1),
        "weekend": sum(1 for day in days if day.weekday() >= 5),
        "perfect": sum(1 for t in graded if t["correct"] == t["total"]),
        "sharpshooter": sum(1 for t in graded if t["correct"] * 5 >= t["total"] * 4),
        "correct_hunter": correct_total,
        "patient": patient,
        "comeback": len(recovered),
        "all_rounder": sum(1 for course in COURSES.values() if course_tests.get(course)),
        "bookworm": len(reading),
        "reading_master": reading_full,
        "mistake_hunter": db.execute("SELECT COUNT(*) FROM mistake_resolutions").fetchone()[0],
        "honest": db.execute("SELECT COUNT(*) FROM study_reflections WHERE uncertain = 1").fetchone()[0],
        "lesson_explorer": db.execute("SELECT COUNT(*) FROM lesson_progress WHERE quiz_total IS NOT NULL").fetchone()[0],
    }
    values.update({badge: course_tests.get(course, 0) for badge, course in COURSES.items()})
    return values, {"current": current_streak, "best": best_streak}


def seen_tiers(db):
    row = db.execute("SELECT value FROM settings WHERE key = 'badges_seen'").fetchone()
    try:
        seen = json.loads(row[0]) if row else {}
    except ValueError:
        seen = {}
    return seen if isinstance(seen, dict) else {}


def mark_seen(db, badges):
    value = json.dumps({b["id"]: b["tier"] for b in badges if b["tier"]})
    db.execute("""INSERT INTO settings(key, value) VALUES ('badges_seen', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value""", (value,))


def calculate(db):
    values, streak = _values(db)
    seen = seen_tiers(db)
    badges, newly = [], []
    for category, badge_id, icon, title, description, goals in BADGES:
        value = values.get(badge_id, 0)
        tier = sum(1 for goal in goals if value >= goal)
        next_goal = goals[tier] if tier < len(goals) else None
        badge = {
            "id": badge_id, "category": category, "icon": icon, "title": title,
            "desc": description.format(goal=next_goal or goals[-1]),
            "goals": list(goals), "value": value, "tier": tier, "maxTier": len(goals),
            "tierName": TIER_NAMES[tier - 1] if tier else None,
            "nextGoal": next_goal, "earned": tier > 0,
            # The n-th tier gives n stars (Bronz 1, Gümüş 2, Altın 3).
            "stars": tier * (tier + 1) // 2,
            "progress": f"{min(value, next_goal)}/{next_goal}" if next_goal else "Tamamlandı",
        }
        badges.append(badge)
        if tier > int(seen.get(badge_id, 0) or 0):
            newly.append({"id": badge_id, "icon": icon, "title": title, "tierName": badge["tierName"],
                          "maxTier": len(goals)})
    stars = sum(b["stars"] for b in badges)
    level_index = max(i for i, (needed, _) in enumerate(LEVELS) if stars >= needed)
    following = LEVELS[level_index + 1] if level_index + 1 < len(LEVELS) else None
    return {
        "badges": badges,
        "categories": CATEGORIES,
        "newlyEarned": newly,
        "streak": streak,
        "stats": {
            "earnedCount": sum(1 for b in badges if b["earned"]),
            "totalCount": len(badges),
            "earnedTiers": sum(b["tier"] for b in badges),
            "totalTiers": sum(b["maxTier"] for b in badges),
            "totalStars": stars,
            "level": {
                "number": level_index + 1, "name": LEVELS[level_index][1], "from": LEVELS[level_index][0],
                "next": following[0] if following else None, "nextName": following[1] if following else None,
            },
        },
    }
