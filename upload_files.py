"""Uploads the local content files to the DataKey file store (see storage.py).

    DOSYA_URL=... DOSYA_TOKEN=... DOSYA_ANAHTARI=... python upload_files.py [--force] [--only PREFIX]
    python upload_files.py --new-key      # prints a fresh DOSYA_ANAHTARI

Parent-only files are encrypted before upload. A file whose stored size already matches is
skipped, so the script can be run again after an interruption; --force uploads everything.
"""

from __future__ import annotations

import argparse
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import storage

BASE = Path(__file__).resolve().parent
ENCRYPTION_OVERHEAD = len(storage.MAGIC) + 12 + 16
SOURCES = [
    ("question_images", "*.png"),
    ("reading_images", "*.png"),
    ("reading_audio", "*.wav"),
    ("lesson_audio", "**/*.wav"),
    ("4_sinif_fasikulleri", "**/*.pdf"),
    ("4_sinif_okuma_becerileri", "*.pdf"),
]
REPORTS = ["data/soru_denetimi.csv", "data/soru_denetimi_ozet.json", "data/ortak_baglam_raporu.json"]


def local_files():
    for folder, pattern in SOURCES:
        yield from sorted((BASE / folder).glob(pattern))
    for report in REPORTS:
        if (BASE / report).is_file():
            yield BASE / report


def upload(path, force):
    name = path.relative_to(BASE).as_posix()
    size = path.stat().st_size
    expected = size + (ENCRYPTION_OVERHEAD if storage.is_secret(name) else 0)
    if not force and storage.remote_size(name) == expected:
        return name, size, "atlandı"
    for attempt in range(3):
        try:
            storage.write(name, path, path.read_bytes())
            return name, size, "yüklendi"
        except storage.StorageError:
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--force", action="store_true", help="aynı boyutta olanları da yükle")
    parser.add_argument("--only", default="", help="yalnızca bu önekle başlayan dosyalar (ör. reading_images/)")
    parser.add_argument("--new-key", action="store_true", help="yeni bir DOSYA_ANAHTARI üret ve yazdır")
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()
    if args.new_key:
        print(storage.new_key())
        return
    if not storage.IS_REMOTE or not storage.DOSYA_TOKEN:
        sys.exit("DOSYA_URL ve DOSYA_TOKEN tanımlanmalı.")
    storage._key()  # fails early when DOSYA_ANAHTARI is missing
    files = [path for path in local_files() if path.relative_to(BASE).as_posix().startswith(args.only)]
    total = sum(path.stat().st_size for path in files)
    print(f"{len(files)} dosya, {total / 1e6:.0f} MB")
    done = sent = skipped = 0
    failed = []
    started = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(upload, path, args.force): path for path in files}
        for future in as_completed(futures):
            done += 1
            try:
                name, size, result = future.result()
                sent += result == "yüklendi"
                skipped += result == "atlandı"
            except storage.StorageError as exc:
                failed.append((futures[future].relative_to(BASE).as_posix(), str(exc)))
            if done % 200 == 0 or done == len(files):
                print(f"  {done}/{len(files)}  yüklenen {sent}, atlanan {skipped}, hata {len(failed)}"
                      f"  ({time.time() - started:.0f} sn)", flush=True)
    for name, error in failed[:20]:
        print("HATA", name, error)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
