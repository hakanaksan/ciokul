"""Audit every imported question against its PDF, answer table and PNG file.

This is an automated consistency audit. It never marks a crop as visually
verified; flagged rows must be checked against the PDF by a person.
"""

from __future__ import annotations

import csv
import json
import sqlite3
from collections import Counter
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageStat

from import_fasikuller import BASE, PDF_ROOT, answer_key, key_page, scan
from reconcile_answer_keys import parse_answer_lines


def main():
    database = sqlite3.connect(BASE / "data" / "cio_okul.sqlite3")
    database.row_factory = sqlite3.Row
    output = BASE / "data" / "soru_denetimi.csv"
    summary = BASE / "data" / "soru_denetimi_ozet.json"
    results = []
    for booklet in database.execute("SELECT * FROM booklets ORDER BY id").fetchall():
        pdf_path = BASE / booklet["pdf_path"]
        document = pdfium.PdfDocument(str(pdf_path))
        first_key = key_page(document)
        locations, _ = scan(document, first_key)
        expected = {number: (page + 1, top) for number, page, top in locations}
        pages = range(first_key, len(document)) if booklet["course"] == "Türkçe" else [first_key]
        key_text = "\n".join(document[i].get_textpage().get_text_range() for i in pages)
        answers = parse_answer_lines(key_text, len(locations))
        alternate_answers = answer_key(document[first_key].get_textpage().get_text_range(), len(locations))
        if booklet["course"] != "Türkçe":
            prefix = 0
            while prefix + 1 in answers:
                prefix += 1
            answers = {n: value for n, value in answers.items() if n <= prefix}
        questions = database.execute(
            "SELECT * FROM questions WHERE booklet_id=? ORDER BY number", (booklet["id"],)
        ).fetchall()
        for question in questions:
            issues = []
            number = question["number"]
            if number not in expected:
                issues.append("pdf_numara_yok")
            elif expected[number][0] != question["page"]:
                issues.append("pdf_sayfa_farki")
            pdf_answers = {value for value in (answers.get(number), alternate_answers.get(number)) if value}
            if len(pdf_answers)>1:
                issues.append("anahtar_kaynaklari_celisiyor")
            if question["answer_key"] and pdf_answers and question["answer_key"] not in pdf_answers:
                issues.append("anahtar_farki")
            elif question["answer_key"] and not pdf_answers:
                issues.append("anahtar_kaynagi_okunamadi")
            elif not question["answer_key"] and pdf_answers:
                issues.append("anahtar_eksik")
            if bool(question["answer_key"]) != (question["kind"] == "multiple_choice"):
                issues.append("soru_turu_anahtar_uyumsuz")
            image_path = BASE / "question_images" / (question["image_path"] or "")
            width = height = ink = 0
            if not image_path.is_file():
                issues.append("gorsel_yok")
            else:
                try:
                    with Image.open(image_path) as image:
                        if image.format != "PNG":
                            issues.append("png_değil")
                        width, height = image.size
                        sample = image.convert("L")
                        sample.thumbnail((240, 800))
                        histogram = sample.histogram()
                        ink = round(sum(histogram[:220]) / max(1, sample.width * sample.height), 5)
                    if width < 350 or height < 85:
                        issues.append("gorsel_cok_kucuk")
                    if height > 3400:
                        issues.append("gorsel_cok_uzun")
                    if ink < 0.002:
                        issues.append("gorsel_bos_gorunuyor")
                except (OSError, ValueError):
                    issues.append("gorsel_acilamadi")
            results.append({
                "question_id": question["id"], "course": booklet["course"],
                "booklet": booklet["title"], "number": number,
                "pdf_page": question["page"], "image_path": question["image_path"],
                "width": width, "height": height, "ink_ratio": ink,
                "answer_key": question["answer_key"], "pdf_answer": ",".join(sorted(pdf_answers)),
                "verified": question["verified"], "issues": "|".join(issues),
            })
        document.close()
        print(f'{booklet["course"]} / {booklet["title"]}: {len(questions)} soru', flush=True)
    with output.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(results[0]))
        writer.writeheader()
        writer.writerows(results)
    counts = Counter(issue for row in results for issue in row["issues"].split("|") if issue)
    summary.write_text(json.dumps({
        "questions": len(results), "clean": sum(not row["issues"] for row in results),
        "flagged": sum(bool(row["issues"]) for row in results),
        "issue_counts": dict(counts)
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(summary.read_text(encoding="utf-8"))
    database.close()


if __name__ == "__main__":
    main()
