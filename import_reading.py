"""Import MEB 4th grade reading activities as page and question images."""

from __future__ import annotations

import json
import re
from pathlib import Path

import pdfplumber
import pypdfium2

BASE = Path(__file__).resolve().parent
SOURCE = BASE / "4_sinif_okuma_becerileri"
BOOK = SOURCE / "4_sinif_okuma_becerileri.pdf"
KEY = SOURCE / "4_sinif_okuma_becerileri_cevap_anahtari.pdf"
OUT = BASE / "reading_images"
MANIFEST = SOURCE / "etkinlikler.json"

# PDF page ranges; question numbering starts again for each reading.
SECTIONS = [
    ("Bizim Çakıl", 10, 12, 15, 13),
    ("Uzayda Yaşam", 16, 21, 24, 13),
    ("Zihninizi Etkili Hâle Getirecek İpuçları", 26, 29, 33, 14),
    ("Bin Yıldızlı Otel", 34, 38, 41, 10),
    ("Giyilebilir Teknolojik Ürünler", 42, 45, 49, 15),
    ("Gökyüzünde Büyük Gösteri: Kutup Işıkları", 50, 53, 54, 6),
    ("Tasarımcı ve Mühendis Hayvanlar", 56, 60, 64, 13),
    ("Bu Robotların Esin Kaynağı Hayvanlar", 66, 69, 74, 14),
    ("Aziz Sancar", 76, 79, 81, 10),
    ("Kuzey Kutbu’nun Kralları: Kutup Ayıları", 82, 85, 88, 10),
]


def markers(page):
    found = []
    for word in page.extract_words():
        if re.fullmatch(r"\d{1,2}\.", word["text"]) and 65 < word["x0"] < 100 and 50 < word["top"] < 700:
            found.append((int(word["text"][:-1]), float(word["top"])))
    return found


def render_crop(pdf, page_no, filename, box=None, scale=2.0):
    path = OUT / filename
    if path.is_file():
        return filename
    page = pdf[page_no - 1]
    image = page.render(scale=scale).to_pil().convert("RGB")
    if box:
        image = image.crop(tuple(round(v * scale) for v in box))
    image.save(path, optimize=True)
    return filename


def answer_letter(page, top, bottom):
    # The official guide prints correct A-D alternatives in magenta CMYK.
    highlighted = [c for c in page.chars if top <= c["top"] < bottom
                   and c.get("non_stroking_color") == (0.0, 1.0, 0.0, 0.0)]
    lines = {}
    for char in highlighted:
        lines.setdefault(round(char["top"]), []).append(char)
    letters = []
    for chars in lines.values():
        chars.sort(key=lambda c: c["x0"])
        text = "".join(c["text"] for c in chars).strip()
        if re.match(r"^[ABCD]\.", text):
            letters.append(text[0])
    return letters[0] if len(set(letters)) == 1 else ""


def square_rows(page, top, bottom):
    rectangles = sorted((r for r in page.rects if top < r["top"] < bottom
                         and 10 < r["width"] < 20 and 10 < r["height"] < 20
                         and 100 < r["x0"] < 250), key=lambda r: r["top"])
    groups = []
    for rectangle in rectangles:
        if not groups or rectangle["top"] - groups[-1][0]["top"] > 2:
            groups.append([rectangle])
        else:
            groups[-1].append(rectangle)
    return [group for group in groups if len(group) >= 2]


def infer_skill(prompt):
    lower = prompt.casefold()
    if any(word in lower for word in ("tablo", "şema", "grafik", "poster", "görsel")):
        return "visual"
    if any(word in lower for word in ("sizce", "olsaydınız", "nedenini", "açıklayınız", "yorum")):
        return "comment"
    if any(word in lower for word in ("neden", "amacı", "anlatmak istemiş", "çıkarım")):
        return "inference"
    return "locate"


def main():
    OUT.mkdir(exist_ok=True)
    with pdfplumber.open(BOOK) as book, pdfplumber.open(KEY) as guide, \
         pypdfium2.PdfDocument(str(BOOK)) as render_book, \
         pypdfium2.PdfDocument(str(KEY)) as render_guide:
        answers = {}
        current = None
        for page_no, page in enumerate(guide.pages, 1):
            header = re.search(r"(\d+)\.\s*OKUMA", page.extract_text() or "")
            if not header:
                continue
            current = int(header.group(1))
            pairs = markers(page)
            for idx, (number, top) in enumerate(pairs):
                if not 1 <= number <= SECTIONS[current - 1][4]:
                    continue
                bottom = pairs[idx + 1][1] - 6 if idx + 1 < len(pairs) else 700
                name = f"R{current:02}_A{number:02}.png"
                render_crop(render_guide, page_no, name, (55, max(43, top - 9), 545, bottom))
                boxes = square_rows(page, top, bottom)
                answers[(current, number)] = {"answer_image": name,
                                              "answer_page": page_no,
                                              "letter": answer_letter(page, top, bottom),
                                              "boxes": boxes,
                                              "max_score": 2 if re.search(r"2\s*[-–]\s*Kabul edilebilir", page.crop((55, top, 545, bottom)).extract_text() or "", re.I) else 1}
        sections = []
        for section_no, (title, first, first_question, last, count) in enumerate(SECTIONS, 1):
            reading_pages = []
            for page_no in range(first, first_question):
                name = f"R{section_no:02}_P{page_no:02}.png"
                render_crop(render_book, page_no, name, scale=1.7)
                reading_pages.append(name)
            questions = []
            for page_no in range(first_question, last + 1):
                page = book.pages[page_no - 1]
                pairs = markers(page)
                for idx, (number, top) in enumerate(pairs):
                    if not 1 <= number <= count:
                        continue
                    bottom = pairs[idx + 1][1] - 6 if idx + 1 < len(pairs) else 700
                    box = (55, max(43, top - 9), 545, bottom)
                    name = f"R{section_no:02}_Q{number:02}.png"
                    render_crop(render_book, page_no, name, box)
                    prompt = " ".join((page.crop((55, top, 545, bottom)).extract_text() or "").split())
                    # Lettered alternatives can be answered directly; diagrams and
                    # unlettered selections remain written responses for parent review.
                    lettered = all(re.search(rf"\b{letter}\.\s", prompt) for letter in "ABCD")
                    kind = "choice" if lettered else "written"
                    answer = answers.get((section_no, number), {})
                    options = []
                    key = answer.get("letter", "") if kind == "choice" else ""
                    if (kind == "written" and re.search(r"işaretleyiniz", prompt, re.I)
                            and not re.search(r"yazınız|açıklayınız|neden", prompt, re.I)):
                        boxes = square_rows(page, top, bottom)
                        answer_boxes = answer.get("boxes", [])
                        if 2 <= len(boxes) <= 10 and len(boxes) == len(answer_boxes):
                            for option_index, group in enumerate(boxes):
                                y = group[0]["top"]
                                end = boxes[option_index + 1][0]["top"] if option_index + 1 < len(boxes) else bottom
                                label = " ".join((page.crop((group[0]["x1"] + 8, y - 5, 515, end)).extract_text() or "").split())
                                options.append(label[:250] if label and "�" not in label else f"Görseldeki {option_index + 1}. seçenek")
                            selected = [str(i + 1) for i, group in enumerate(answer_boxes)
                                        if any(rect.get("non_stroking_color") == (0.0, 1.0, 0.0, 0.0) for rect in group)]
                            if selected:
                                kind, key = "multi", ",".join(selected)
                    questions.append({"number": number, "page": page_no, "image": name,
                                      "kind": kind, "prompt": prompt[:1000],
                                      "skill": infer_skill(prompt),
                                      "key": key, "options": options,
                                      "max_score": answer.get("max_score", 1),
                                      "answer_image": answer.get("answer_image", ""),
                                      "answer_page": answer.get("answer_page", 0)})
            questions.sort(key=lambda q: q["number"])
            actual = [q["number"] for q in questions]
            if actual != list(range(1, count + 1)):
                raise ValueError(f"Reading {section_no}: questions {actual}")
            if any(not q["answer_image"] for q in questions):
                raise ValueError(f"Reading {section_no}: missing answer crop")
            sections.append({"number": section_no, "title": title, "pages": reading_pages,
                             "questions": questions})
        MANIFEST.write_text(json.dumps(sections, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Imported {len(sections)} readings, {sum(len(s['questions']) for s in sections)} questions")
        print(f"Choice questions: {sum(q['kind']=='choice' for s in sections for q in s['questions'])}")
        print(f"Keys found: {sum(bool(q['key']) for s in sections for q in s['questions'])}")


if __name__ == "__main__":
    main()
