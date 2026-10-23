"""Extract and populate question stems from MEB PDF workbooks into cio_okul.sqlite3.
Preserves existing non-empty manually edited stems.
"""

from __future__ import annotations

import sqlite3
import time
from pathlib import Path

import pypdfium2 as pdfium
import import_fasikuller
from app import BASE, DB_PATH, DB_LOCK, connect


def clean_text(text: str) -> str:
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    cleaned = [
        l for l in lines
        if not ("ÖLÇME" in l and "DEĞERLENDİRME" in l)
        and not ("GENEL MÜDÜRLÜĞÜ" in l)
        and not ("BAKANLIĞI" in l and "MİLLÎ EĞİTİM" in l)
    ]
    return "\n".join(cleaned)


def extract_stems():
    t0 = time.time()
    with connect() as db:
        booklets = db.execute("SELECT id, course, title, pdf_path FROM booklets ORDER BY id").fetchall()

    print(f"Toplam {len(booklets)} fasikül taranıyor...")
    total_updated = 0

    with connect() as db:
        for b in booklets:
            booklet_id = b["id"]
            pdf_file = BASE / b["pdf_path"]
            if not pdf_file.is_file():
                continue

            try:
                doc = pdfium.PdfDocument(str(pdf_file))
                first_key = import_fasikuller.key_page(doc)
                locations, _ = import_fasikuller.scan(doc, first_key)

                updates = []
                for i, location in enumerate(locations):
                    number, page_index, top = location
                    next_location = locations[i + 1] if i + 1 < len(locations) else None
                    page = doc[page_index]
                    w, h = page.get_size()
                    top_screen = max(20, top - 9)
                    bottom_screen = (
                        next_location[2] - 7
                        if next_location and next_location[1] == page_index
                        else min(795, h - 38)
                    )

                    pdf_top = h - top_screen
                    pdf_bottom = h - bottom_screen
                    text = page.get_textpage().get_text_bounded(
                        left=30, bottom=pdf_bottom, right=w - 30, top=pdf_top
                    )

                    if (
                        next_location
                        and next_location[1] == page_index + 1
                        and next_location[2] > 110
                    ):
                        next_page = doc[page_index + 1]
                        nw, nh = next_page.get_size()
                        c_top = nh - 35
                        c_bottom = nh - (next_location[2] - 7)
                        c_text = next_page.get_textpage().get_text_bounded(
                            left=30, bottom=c_bottom, right=nw - 30, top=c_top
                        )
                        text = text + "\n" + c_text

                    cleaned = clean_text(text)
                    if cleaned:
                        updates.append((cleaned, booklet_id, number))

                # Batch update only if stem is empty
                db.executemany(
                    """UPDATE questions 
                       SET stem = ? 
                       WHERE booklet_id = ? AND number = ? AND (stem IS NULL OR stem = '')""",
                    updates,
                )
                db.commit()
                total_updated += len(updates)
                print(f"  [{b['course']} - {b['title']}] {len(updates)} soru metni çıkarıldı.")
                doc.close()
            except Exception as exc:
                print(f"  [Hata - {b['title']}] {exc}")

    print(f"Tamamlandı! Toplam {total_updated} soru metni güncellendi. Süre: {time.time() - t0:.1f}s")


if __name__ == "__main__":
    extract_stems()
