"""Render visually reviewed question regions from the first pilot booklet.

Coordinates are relative to a 990 x 1400 reference rendering. They were
checked against the PDF pages, including all diagrams and answer choices.
"""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageOps, ImageDraw


BASE = Path(__file__).resolve().parent
PDF = BASE / "4_sinif_fasikulleri" / "Din_Kulturu_ve_Ahlak_Bilgisi" / "unite_01.pdf"
OUT = BASE / "question_images"
POPPLER = Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe"

# PDF page: (question number, left, top, right, bottom)
REGIONS = {
    6: [(1, 50, 45, 940, 255), (2, 50, 305, 940, 540),
        (3, 50, 585, 940, 715), (4, 50, 775, 940, 960),
        (5, 50, 1025, 940, 1305)],
    7: [(6, 50, 30, 940, 345), (7, 50, 355, 940, 520),
        (8, 50, 535, 940, 780), (9, 50, 805, 940, 1325)],
    8: [(10, 50, 50, 940, 300), (11, 50, 445, 940, 670),
        (12, 50, 740, 940, 1305)],
}


def main() -> None:
    if not POPPLER.is_file():
        raise FileNotFoundError(f"PDF renderer not found: {POPPLER}")
    OUT.mkdir(exist_ok=True)
    thumbnails = []
    with tempfile.TemporaryDirectory() as temporary:
        for page, regions in REGIONS.items():
            prefix = Path(temporary) / f"page-{page}"
            subprocess.run([
                str(POPPLER), "-f", str(page), "-l", str(page),
                "-scale-to-y", "2200", "-png", "-singlefile", str(PDF), str(prefix),
            ], check=True, stdout=subprocess.DEVNULL)
            with Image.open(prefix.with_suffix(".png")) as source:
                source = source.convert("RGB")
                xscale, yscale = source.width / 990, source.height / 1400
                for number, left, top, right, bottom in regions:
                    box = tuple(round(v * s) for v, s in zip(
                        (left, top, right, bottom), (xscale, yscale, xscale, yscale)))
                    crop = source.crop(box)
                    name = f"DKAB_U01_S{number:03}.png"
                    crop.save(OUT / name, optimize=True)
                    thumb = crop.copy()
                    thumb.thumbnail((440, 440))
                    tile = Image.new("RGB", (460, 490), "#eef2ee")
                    tile.paste(thumb, ((460 - thumb.width) // 2, 33))
                    ImageDraw.Draw(tile).text((12, 10), name, fill="#1e4941")
                    thumbnails.append(tile)
                    print(f"{name}: {crop.width}x{crop.height}")
    sheet = Image.new("RGB", (460 * 3, 490 * 4), "white")
    for i, tile in enumerate(thumbnails):
        sheet.paste(tile, ((i % 3) * 460, (i // 3) * 490))
    sheet.save(OUT / "_kontrol.png", optimize=True)


if __name__ == "__main__":
    main()
