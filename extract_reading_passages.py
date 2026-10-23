"""PDF metin katmanindan okuma gecitlerini cikarir (OCR yok, tam otomatik)."""
import json
import re
from pathlib import Path

BASE = Path(__file__).resolve().parent
SECTIONS = [
    ("Bizim Cakil", 10, 12), ("Uzayda Yasam", 16, 21), ("Zihin Ipuclari", 26, 29),
    ("Bin Yildizli Otel", 34, 38), ("Giyilebilir Urunler", 42, 45), ("Kutup Isiklari", 50, 53),
    ("Tasarimci Hayvanlar", 56, 60), ("Robotlar", 66, 69), ("Aziz Sancar", 76, 79),
    ("Kutup Ayilari", 82, 85),
]

def clean(text):
    lines = [l.strip() for l in text.replace("\r\n", "\n").split("\n")]
    # Baslik bloklarini at: ilk 3 satir (kitap adi, "N. OKUMA", sayfa no)
    if len(lines) >= 3 and re.match(r"\d+\.\s*OKUMA", lines[1] or ""):
        lines = lines[3:]
    elif lines and re.match(r"^\d+$", lines[0] or ""):
        lines = lines[1:]
    out, buf = [], ""
    for line in lines:
        if not line:
            if buf: out.append(buf); buf = ""
            continue
        if not buf:
            buf = line
        elif buf.endswith("-"):
            buf = buf[:-1] + line
        else:
            buf = buf + " " + line
    if buf: out.append(buf)
    text = "\n\n".join(out)
    return re.sub(r"[ \t]{2,}", " ", text).strip()

def main():
    import pypdfium2
    result = []
    with pypdfium2.PdfDocument(str(BASE / "4_sinif_okuma_becerileri" / "4_sinif_okuma_becerileri.pdf")) as doc:
        for no, (slug, first, fq) in enumerate(SECTIONS, 1):
            parts = [clean(doc[p - 1].get_textpage().get_text_range()) for p in range(first, fq)]
            full = "\n\n".join(p for p in parts if p)
            result.append({"section": no, "pages": list(range(first, fq)),
                           "chars": len(full), "text": full})
            print(f"R{no:02}: {len(full)} karakter")
    out = BASE / "data" / "reading_passages.json"
    out.write_text(json.dumps(result, ensure_ascii=False, indent=1), encoding="utf-8")
    print("Yazildi:", out)

if __name__ == "__main__":
    main()
