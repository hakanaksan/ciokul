"""Read MEB answer tables and update confidently identified A-D questions."""

import json
import re
import sqlite3
from pathlib import Path

import pypdfium2 as pdfium

from import_fasikuller import BASE, DB_PATH, PDF_ROOT, key_page


def parse_answer_lines(text, limit):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    answers = {}
    for index, line in enumerate(lines):
        match = re.fullmatch(r"(\d{1,3})\.?\s+([A-D])", line)
        if not match and re.fullmatch(r"\d{1,3}\.", line) and index + 1 < len(lines):
            letter = lines[index + 1]
            if re.fullmatch(r"[A-D]", letter):
                match = re.fullmatch(r"(\d{1,3})\.", line)
                number, answer = int(match[1]), letter
            else:
                continue
        elif match:
            number, answer = int(match[1]), match[2]
        else:
            continue
        if 1 <= number <= limit:
            answers.setdefault(number, set()).add(answer)
    return {n: next(iter(letters)) for n, letters in answers.items() if len(letters) == 1}


def main():
    db = sqlite3.connect(DB_PATH)
    manifest = json.loads((PDF_ROOT / "kaynaklar.json").read_text(encoding="utf-8"))
    total = 0
    for item in manifest["dosyalar"]:
        relative = (Path("4_sinif_fasikulleri") / item["dosya"]).as_posix()
        booklet = db.execute("SELECT id FROM booklets WHERE pdf_path=?", (relative,)).fetchone()
        if not booklet:
            continue
        booklet_id = booklet[0]
        count = db.execute("SELECT COUNT(*) FROM questions WHERE booklet_id=?", (booklet_id,)).fetchone()[0]
        doc = pdfium.PdfDocument(str(BASE / relative))
        first = key_page(doc)
        pages = range(first, len(doc)) if item["ders"] == "Turkce" else [first]
        answers = parse_answer_lines("\n".join(doc[i].get_textpage().get_text_range() for i in pages), count)
        if item["ders"] != "Turkce":
            prefix = 0
            while prefix + 1 in answers:
                prefix += 1
            answers = {n: letter for n, letter in answers.items() if n <= prefix}
        changed = 0
        for number, letter in answers.items():
            cursor = db.execute("""UPDATE questions SET kind='multiple_choice',answer_key=?
                WHERE booklet_id=? AND number=? AND answer_key=''""", (letter, booklet_id, number))
            changed += cursor.rowcount
        db.commit()
        total += changed
        print(f"{item['dosya']}: {len(answers)} anahtar, {changed} yeni", flush=True)
        doc.close()
    report_file = BASE / "data" / "ice_aktarma_raporu.json"
    reports = json.loads(report_file.read_text(encoding="utf-8"))
    for item, report in zip(manifest["dosyalar"], reports):
        relative = (Path("4_sinif_fasikulleri") / item["dosya"]).as_posix()
        report["anahtarli"] = db.execute("""SELECT COUNT(*) FROM questions q
            JOIN booklets b ON b.id=q.booklet_id WHERE b.pdf_path=? AND q.answer_key!=''""",
            (relative,)).fetchone()[0]
    report_file.write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding="utf-8")
    db.close()
    print(f"Toplam {total} yeni anahtar", flush=True)


if __name__ == "__main__":
    main()
