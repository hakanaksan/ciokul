"""Download and verify the 4th-grade workbooks linked by MEB."""

from __future__ import annotations

import hashlib
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen


PAGE_URL = "https://odsgm.meb.gov.tr/www/4-sinif-calisma-fasikulleri/icerik/615"
ROOT = Path(__file__).resolve().parent / "4_sinif_fasikulleri"
COURSES = [
    ("Turkce", ["tema_01_02.pdf", "tema_03_04.pdf", "tema_05_06.pdf", "tema_07_08.pdf"]),
    ("Matematik", [f"unite_{n:02}.pdf" for n in range(1, 7)]),
    ("Din_Kulturu_ve_Ahlak_Bilgisi", [f"unite_{n:02}.pdf" for n in range(1, 6)]),
    ("Fen_Bilimleri", [f"unite_{n:02}.pdf" for n in range(1, 8)]),
    ("Sosyal_Bilgiler", [f"unite_{n:02}.pdf" for n in range(1, 8)]),
    ("Ingilizce", [f"unite_{n:02}.pdf" for n in range(1, 11)]),
]


class PdfLinks(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        href = dict(attrs).get("href")
        if href and href.lower().split("?")[0].endswith(".pdf"):
            absolute = urljoin(PAGE_URL, href).replace("http://odsgm.meb.gov.tr/", "https://odsgm.meb.gov.tr/")
            if "/2021_" in absolute or "/icerik/2021/" in absolute:
                self.links.append(absolute)


def fetch(url: str) -> bytes:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; CioOkul/1.0)"})
    with urlopen(request, timeout=120) as response:
        return response.read()


def download(item: tuple[str, str, str]) -> dict:
    course, filename, url = item
    path = ROOT / course / filename
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_bytes().startswith(b"%PDF-"):
        data = path.read_bytes()
    else:
        for attempt in range(3):
            try:
                data = fetch(url)
                if not data.startswith(b"%PDF-"):
                    raise ValueError("Yanıt PDF değil")
                temporary = path.with_suffix(".part")
                temporary.write_bytes(data)
                temporary.replace(path)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(2 * (attempt + 1))
    return {
        "ders": course,
        "dosya": str(path.relative_to(ROOT)).replace("\\", "/"),
        "kaynak": url,
        "boyut_bayt": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def main() -> None:
    page = fetch(PAGE_URL).decode("utf-8", errors="replace")
    parser = PdfLinks()
    parser.feed(page)
    links = list(dict.fromkeys(parser.links))
    names = [(course, filename) for course, filenames in COURSES for filename in filenames]
    if len(links) != len(names):
        raise RuntimeError(f"Beklenen {len(names)} ayrı PDF, bulunan {len(links)}. Site düzeni değişmiş olabilir.")
    items = [(course, filename, url) for (course, filename), url in zip(names, links)]
    results = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {pool.submit(download, item): item for item in items}
        for future in as_completed(futures):
            item = futures[future]
            try:
                result = future.result()
                results.append(result)
                print(f"OK {result['dosya']} ({result['boyut_bayt']:,} bayt)", flush=True)
            except Exception as exc:
                print(f"HATA {item[0]}/{item[1]}: {exc}", flush=True)
    results.sort(key=lambda item: names.index((item["ders"], Path(item["dosya"]).name)))
    ROOT.mkdir(exist_ok=True)
    (ROOT / "kaynaklar.json").write_text(
        json.dumps({"sayfa": PAGE_URL, "dosyalar": results}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if len(results) != len(names):
        raise SystemExit(f"{len(results)}/{len(names)} PDF indirildi")
    print(f"Tamamlandı: {len(results)} PDF, {sum(x['boyut_bayt'] for x in results):,} bayt")


if __name__ == "__main__":
    main()
