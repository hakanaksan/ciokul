"""Import every downloaded MEB workbook as cropped question images and SQLite rows.

Run after downloading the PDFs: python import_fasikuller.py
The importer keeps existing questions, answers, assignments, and reviewed pilot crops.
"""

from __future__ import annotations

import json
import re
import sqlite3
from collections import defaultdict
from pathlib import Path

import pypdfium2 as pdfium


BASE = Path(__file__).resolve().parent
PDF_ROOT = BASE / "4_sinif_fasikulleri"
IMAGE_ROOT = BASE / "question_images"
DB_PATH = BASE / "data" / "cio_okul.sqlite3"
COURSES = {
    "Turkce": ("Türkçe", "TURKCE"),
    "Matematik": ("Matematik", "MAT"),
    "Din_Kulturu_ve_Ahlak_Bilgisi": ("Din Kültürü ve Ahlak Bilgisi", "DKAB"),
    "Fen_Bilimleri": ("Fen Bilimleri", "FEN"),
    "Sosyal_Bilgiler": ("Sosyal Bilgiler", "SOSYAL"),
    "Ingilizce": ("İngilizce", "ING"),
}
MARKER = re.compile(r"(?m)(?:^|\n)\s*(\d{1,3})\.")
KEY_PAIR = re.compile(r"(?<!\d)(\d{1,3})\.?\s+([A-D])\b")


def key_page(doc):
    for index in range(5, len(doc)):
        text = doc[index].get_textpage().get_text_range()
        if "CEVAP ANAHTARI" in text:
            return index
    raise ValueError("Cevap anahtarı bulunamadı")


def markers_on_page(page, index):
    textpage = page.get_textpage()
    text = textpage.get_text_range()
    height = page.get_size()[1]
    found = []
    for match in MARKER.finditer(text):
        x0, _, _, y1 = textpage.get_charbox(match.start(1))
        top = height - y1
        if 30 <= x0 <= 60 and 25 <= top <= 785:
            found.append((int(match.group(1)), index, top))
    # One MEB print omits the dot after 25 in Mathematics unit 2.
    if "25" in text and not any(n == 25 for n, _, _ in found):
        for match in re.finditer(r"(?m)(?:^|\n)\s*(25)(?:\s|$)", text):
            x0, _, _, y1 = textpage.get_charbox(match.start(1))
            top = height - y1
            if 30 <= x0 <= 55 and 25 <= top <= 785:
                found.append((25, index, top))
    return found, text


def scan(doc, first_key):
    candidates = defaultdict(list)
    page_texts = {}
    for index in range(5, first_key):
        found, text = markers_on_page(doc[index], index)
        page_texts[index] = text
        for number, page, top in found:
            candidates[number].append((page, top))
    # The leading column of printed question numbers is stable across all booklets.
    # A few numbers repeat inside an exercise; their first occurrence is the heading.
    count = 0
    while count + 1 in candidates:
        count += 1
    locations = [(number, *min(candidates[number])) for number in range(1, count + 1)]
    if not locations or any((b[1], b[2]) <= (a[1], a[2]) for a, b in zip(locations, locations[1:])):
        raise ValueError("Soru numaraları sıralı değil")
    return locations, page_texts


def answer_key(text, count):
    answers = {}
    started = False
    for line in text.splitlines():
        matches = KEY_PAIR.findall(line)
        remainder = KEY_PAIR.sub("", line).strip()
        if matches and not remainder:
            started = True
            for number, letter in matches:
                number = int(number)
                if 1 <= number <= count:
                    answers.setdefault(number, set()).add(letter)
        elif started and re.match(r"^\s*\d{1,3}\.?\s", line):
            break
    return {n: next(iter(letters)) for n, letters in answers.items() if len(letters) == 1}


def crop(doc, location, next_location, target):
    from PIL import Image

    number, page_index, top = location
    page = doc[page_index]
    width, height = page.get_size()
    end = next_location[2] - 7 if next_location and next_location[1] == page_index else min(795, height - 38)
    if end - top < 20:
        raise ValueError(f"Kısa soru alanı: {number}")
    scale = 1.7
    image = page.render(scale=scale).to_pil().convert("RGB")
    result = image.crop((round(34 * scale), round(max(25, top - 9) * scale),
                         round(min(width - 33, 562) * scale), round(end * scale)))
    if next_location and next_location[1] == page_index + 1 and next_location[2] > 110:
        # Some long exercises continue at the top of the following page.
        continuation = doc[page_index + 1].render(scale=scale).to_pil().convert("RGB")
        continuation = continuation.crop((round(34 * scale), round(35 * scale),
                                           round(min(width - 33, 562) * scale),
                                           round((next_location[2] - 7) * scale)))
        combined = Image.new("RGB", (max(result.width, continuation.width),
                                     result.height + continuation.height + 12), "white")
        combined.paste(result, (0, 0))
        combined.paste(continuation, (0, result.height + 12))
        result = combined
    target.parent.mkdir(exist_ok=True)
    result.save(target, format="PNG", optimize=True)


def main():
    from app import init_db

    init_db()
    manifest = json.loads((PDF_ROOT / "kaynaklar.json").read_text(encoding="utf-8"))
    IMAGE_ROOT.mkdir(exist_ok=True)
    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA foreign_keys=ON")
    reports = []
    try:
        for item in manifest["dosyalar"]:
            relative_pdf = Path(item["dosya"])
            path = PDF_ROOT / relative_pdf
            course, prefix = COURSES[item["ders"]]
            unit = relative_pdf.stem.upper()
            code = f"{prefix}_{unit.replace('UNITE_', 'U').replace('TEMA_', 'T')}"
            title = (relative_pdf.stem.replace("unite_", "Ünite ").replace("tema_", "Tema ")
                     .replace("_", "–"))
            relative = (Path("4_sinif_fasikulleri") / relative_pdf).as_posix()
            doc = pdfium.PdfDocument(str(path))
            first_key = key_page(doc)
            locations, page_texts = scan(doc, first_key)
            keys = answer_key(doc[first_key].get_textpage().get_text_range(), len(locations))
            matches = [row[0] for row in db.execute("SELECT id,pdf_path FROM booklets")
                       if row[1].replace("\\", "/") == relative]
            if matches:
                booklet_id = min(matches)
                for duplicate_id in matches:
                    if duplicate_id == booklet_id:
                        continue
                    for duplicate_qid, number in db.execute(
                            "SELECT id,number FROM questions WHERE booklet_id=?", (duplicate_id,)).fetchall():
                        keeper = db.execute("SELECT id FROM questions WHERE booklet_id=? AND number=?",
                                            (booklet_id, number)).fetchone()
                        if keeper:
                            if db.execute("SELECT 1 FROM assignment_questions WHERE question_id=?",
                                          (duplicate_qid,)).fetchone():
                                raise ValueError("Atanmış yinelenen soru otomatik birleştirilemez")
                            db.execute("DELETE FROM choices WHERE question_id=?", (duplicate_qid,))
                            db.execute("DELETE FROM questions WHERE id=?", (duplicate_qid,))
                        else:
                            db.execute("UPDATE questions SET booklet_id=? WHERE id=?", (booklet_id, duplicate_qid))
                    db.execute("DELETE FROM booklets WHERE id=?", (duplicate_id,))
                db.execute("UPDATE booklets SET course=?,title=?,source_url=? WHERE id=?",
                           (course, title, item["kaynak"], booklet_id))
                db.execute("UPDATE booklets SET pdf_path=? WHERE id=?", (relative, booklet_id))
            else:
                booklet_id = db.execute("INSERT INTO booklets(course,title,pdf_path,source_url) VALUES (?,?,?,?)",
                                        (course, title, relative, item["kaynak"])).lastrowid
            for i, location in enumerate(locations):
                number, page_index, _ = location
                next_location = locations[i + 1] if i + 1 < len(locations) else None
                image_name = f"{code}_S{number:03}.png"
                image_path = IMAGE_ROOT / image_name
                if not image_path.is_file():
                    crop(doc, location, next_location, image_path)
                key = keys.get(number, "")
                # Without a reliable key, retain a free text answer field; parents
                # can inspect the original image and decide its grade manually.
                kind = "multiple_choice" if key else "written"
                row = db.execute("SELECT id FROM questions WHERE booklet_id=? AND number=?",
                                 (booklet_id, number)).fetchone()
                if row:
                    db.execute("UPDATE questions SET image_path=?,page=? WHERE id=?",
                               (image_name, page_index + 1, row[0]))
                else:
                    db.execute("""INSERT INTO questions(booklet_id,number,page,kind,stem,answer_key,verified,image_path)
                        VALUES (?,?,?,?,?,?,0,?)""",
                        (booklet_id, number, page_index + 1, kind, "", key, image_name))
            db.commit()
            reports.append({"ders": course, "fasikul": title, "soru": len(locations),
                            "anahtarli": len(keys), "ilk_cevap_sayfasi": first_key + 1})
            print(f"{course} / {title}: {len(locations)} soru, {len(keys)} anahtarlı", flush=True)
            doc.close()
    finally:
        db.close()
    (BASE / "data" / "ice_aktarma_raporu.json").write_text(
        json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"TOPLAM: {len(reports)} fasikül, {sum(r['soru'] for r in reports)} soru", flush=True)


if __name__ == "__main__":
    main()
