"""Hikâye Kitaplığı seslerini ve cümle zamanlarını üretir (sunucuda değil, bu bilgisayarda çalışır).

Kullanim:  python generate_story_audio.py [kayip-pusula ...]   (adsiz = sesi eksik hikayeler)
           `--force` var olan sesleri de yeniden uretir; `--piper` DataKey yerine yerel Piper kullanir.
Ses ve token: generate_lesson_audio.py ile ayni (DataKey ses servisi, SES_TOKEN).
Cikti:     story_audio/<hikaye>/<sayfa>.wav ve stories/<hikaye>.audio.json
           (sayfa suresi ve her cumlenin baslangic/bitis saniyesi; okunan cumle vurgulanir).
Sesler depoya `upload_files.py --only story_audio/` ile yuklenir.
"""
import json
import sys
from pathlib import Path

import generate_lesson_audio as lesson_audio

BASE = Path(__file__).resolve().parent
STORIES = BASE / "stories"
OUT = BASE / "story_audio"


def main():
    force = "--force" in sys.argv
    if "--piper" in sys.argv:
        speak, voice = lesson_audio.speak_piper, "piper tr_TR-dfki-medium"
    else:
        token = lesson_audio.ses_token()
        if not token:
            sys.exit("SES_TOKEN yok: ortam degiskeni olarak ya da .env.datakey icine `SES_TOKEN=...` yazin "
                     "(ya da --piper ile yerel sesi kullanin).")
        speak, voice = (lambda text, target: lesson_audio.speak_datakey(text, target, token)), "datakey-ses antalia-mini"
    names = [a for a in sys.argv[1:] if not a.startswith("--")]
    files = [STORIES / f"{n}.json" for n in names] or sorted(
        p for p in STORIES.glob("*.json") if not p.name.endswith(".audio.json"))
    for path in files:
        story = json.loads(path.read_text(encoding="utf-8"))
        manifest_path = STORIES / f"{story['id']}.audio.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.is_file() else {"pages": {}}
        for page in story["pages"]:
            sentences = [s for paragraph in page["paragraphs"] for s in paragraph]
            target = OUT / story["id"] / f"{page['id']}.wav"
            known = manifest["pages"].get(page["id"])
            if not force and target.is_file() and known and len(known["sentences"]) == len(sentences):
                print(f"{story['id']}/{page['id']}: var, atlaniyor")
                continue
            print(f"{story['id']}/{page['id']}: {len(sentences)} cumle uretiliyor...", flush=True)
            manifest["pages"][page["id"]] = lesson_audio.build_scene({"sentences": sentences}, target, speak)
            manifest["voice"] = voice
        manifest["pages"] = {p["id"]: manifest["pages"][p["id"]] for p in story["pages"]}
        manifest["duration"] = round(sum(p["duration"] for p in manifest["pages"].values()), 2)
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{story['id']}: toplam {manifest['duration'] / 60:.1f} dakika -> {manifest_path.name}")


if __name__ == "__main__":
    main()
