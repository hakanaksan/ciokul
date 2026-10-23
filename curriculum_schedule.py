"""Approximate 2026–2027 practice months for the imported 4th-grade booklets.

The old 4th-grade curriculum still applies in 2026–2027. Unit durations are
from the official 2018 programmes. Turkish themes and English units are paced
evenly because these booklets do not prescribe a universal classroom calendar.
Practice starts after the approximate end of a unit, two 15-question tests per
week. The UI deliberately displays only the month, never an exact due date.
"""

from __future__ import annotations

import math
from datetime import date, timedelta
from pathlib import Path


SCHOOL_YEAR = "2026–2027"
MONTHS = ("", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
          "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık")
BREAK_MONDAYS = {
    date(2026, 11, 16),
    date(2027, 1, 25), date(2027, 2, 1),
    date(2027, 3, 8),
}
TEACHING_WEEKS = []
week = date(2026, 9, 14)
while week <= date(2027, 6, 21):
    if week not in BREAK_MONDAYS:
        TEACHING_WEEKS.append(week)
    week += timedelta(days=7)

# 4th-grade time distributions in the official programmes. The DKAB unit-end
# weeks follow the 2026–2027 DKAB 4 framework plan.
COURSE_PLAN = {
    "Turkce": {"hours_per_week": 8, "unit_hours": [72, 72, 72, 72]},
    "Matematik": {"hours_per_week": 5, "unit_hours": [28, 22, 34, 30, 35, 31]},
    "Din_Kulturu_ve_Ahlak_Bilgisi": {"end_weeks": [9, 16, 23, 31, 36]},
    "Fen_Bilimleri": {"hours_per_week": 3, "unit_hours": [15, 18, 12, 21, 21, 6, 6]},
    "Sosyal_Bilgiler": {"hours_per_week": 3, "unit_hours": [12, 14, 20, 16, 18, 14, 14]},
    "Ingilizce": {"hours_per_week": 2, "unit_hours": [7, 7, 7, 7, 7, 7, 7, 7, 8, 8]},
}
SOURCES = [
    {"title": "MEB 2026–2027 çalışma takvimi",
     "url": "https://meb.gov.tr/2026-2027-egitim-ogretim-yili-takvimi-aciklandi/haber/41057/tr"},
    {"title": "MEB 4. sınıf fasikülleri",
     "url": "https://odsgm.meb.gov.tr/www/4-sinif-calisma-fasikulleri/icerik/615"},
    {"title": "4. sınıfta uygulanan program açıklaması",
     "url": "https://tymm.meb.gov.tr/taslak-cerceve-planlari/temel-egitim"},
    {"title": "MEB matematik öğretim programı",
     "url": "https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf"},
    {"title": "MEB fen bilimleri öğretim programı",
     "url": "https://mufredat.meb.gov.tr/Dosyalar/201812312311937-FEN%20B%C4%B0L%C4%B0MLER%C4%B0%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI2018.pdf"},
    {"title": "MEB sosyal bilgiler öğretim programı",
     "url": "https://mufredat.meb.gov.tr/Dosyalar/201812103847686-SOSYAL%20B%C4%B0LG%C4%B0LER%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%20.pdf"},
    {"title": "MEB DKAB 4 çerçeve yıllık planı",
     "url": "https://dogm.meb.gov.tr/Programlar/CerceveYillikPlan/DKAB/2026-2027dkab4.xlsx"},
]


def booklet_index(pdf_path: str) -> tuple[str, int]:
    relative = Path(pdf_path.replace("\\", "/"))
    folder = relative.parts[-2]
    name = relative.stem
    if name.startswith("unite_"):
        return folder, int(name.rsplit("_", 1)[1]) - 1
    if name.startswith("tema_"):
        return folder, (int(name.split("_")[1]) - 1) // 2
    raise ValueError(f"Bilinmeyen fasikül: {pdf_path}")


def unit_end_week(pdf_path: str) -> int:
    course, index = booklet_index(pdf_path)
    plan = COURSE_PLAN[course]
    if "end_weeks" in plan:
        return plan["end_weeks"][index] - 1
    elapsed_hours = sum(plan["unit_hours"][:index + 1])
    return min(35, math.ceil(elapsed_hours / plan["hours_per_week"]) - 1)


def annotate_booklet(booklet: dict, test_size: int = 15) -> dict:
    result = dict(booklet)
    count = int(result["count"])
    end_week = unit_end_week(result["pdf_path"])
    tests = []
    for index in range(math.ceil(count / test_size)):
        # Two short practice tests a week after a unit is roughly complete.
        target_week = min(len(TEACHING_WEEKS) - 1, end_week + index // 2)
        target = TEACHING_WEEKS[target_week]
        tests.append({
            "test": index + 1,
            "from": index * test_size + 1,
            "to": min(count, (index + 1) * test_size),
            "month": f"{MONTHS[target.month]} {target.year}",
            "yearMonth": target.strftime("%Y-%m"),
        })
    result["suggestedTests"] = tests
    result["suggestedMonths"] = (
        tests[0]["month"] if tests and tests[0]["month"] == tests[-1]["month"]
        else f"{tests[0]['month']} – {tests[-1]['month']}" if tests else ""
    )
    return result
