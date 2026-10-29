"""Video derslerin seslerini ve cümle zamanlarını üretir (sunucuda değil, bu bilgisayarda çalışır).

Kullanim:  python generate_lesson_audio.py [fosiller ...]   (adsiz = sesi eksik dersler)
           `--force` var olan sesleri de yeniden uretir; `--piper` DataKey yerine yerel Piper kullanir.
Ses:       Varsayilan DataKey ses servisi (https://ses.app.datakey.tr, Antalia-2 Mini). Token
           SES_TOKEN ortam degiskeninden ya da .env.datakey icindeki `SES_TOKEN=...` satirindan okunur;
           token yalnizca bu betikte kullanilir, uygulamaya ve depoya girmez.
           Yedek: tools/piper/piper/piper.exe + tools/piper/voices/tr_TR-dfki-medium.onnx
Cikti:     lesson_audio/<ders>/<sahne>.wav (mono 16 bit WAV) ve lessons/<ders>.audio.json
           (sahne suresi ve her cumlenin baslangic/bitis saniyesi; altyazi ve sahne adimlari icin).
Sesler depoya `upload_files.py --only lesson_audio/ --force` ile yuklenir.
"""
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import wave
from pathlib import Path

BASE = Path(__file__).resolve().parent
PIPER = BASE / "tools" / "piper" / "piper" / "piper.exe"
MODEL = BASE / "tools" / "piper" / "voices" / "tr_TR-dfki-medium.onnx"
LESSONS = BASE / "lessons"
OUT = BASE / "lesson_audio"
PAUSE = 0.45          # seconds between sentences
LENGTH_SCALE = "1.12"  # Piper: a little slower than normal, for 9-10 year olds
SES_URL = os.environ.get("SES_URL", "https://ses.app.datakey.tr").rstrip("/")
SES_SPEED = 0.9        # DataKey: 0.7-1.3, service default 0.95
SES_RATE = 24000


def ses_token():
    token = os.environ.get("SES_TOKEN", "").strip()
    env_file = BASE / ".env.datakey"
    if not token and env_file.is_file():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            key, _, value = line.partition("=")
            if key.strip() == "SES_TOKEN":
                token = value.strip()
    return token


def speak_piper(text, target):
    proc = subprocess.run([str(PIPER), "-m", str(MODEL), "-f", str(target), "--length_scale", LENGTH_SCALE, "-q"],
                          input=text, capture_output=True, text=True, encoding="utf-8")
    if proc.returncode != 0 or not target.is_file():
        sys.exit(f"Piper hatasi: {text[:60]}\n{proc.stderr[-1500:]}")


def speak_datakey(text, target, token):
    body = json.dumps({"metin": text, "bicim": "wav", "ornekleme": SES_RATE, "hiz": SES_SPEED, "tohum": 0}).encode()
    request = urllib.request.Request(SES_URL + "/v1/ses", data=body, method="POST", headers={
        "Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    # The service answers 503 while busy, and the network guard in front of it can reset a connection.
    for attempt in range(5):
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                target.write_bytes(response.read())
            return
        except urllib.error.HTTPError as error:
            if error.code != 503:
                sys.exit(f"Ses servisi HTTP {error.code}: {error.read()[:300].decode('utf-8', 'replace')}")
            reason = "mesgul"
        except OSError as error:
            reason = error
        print(f"  ses servisi ({reason}), tekrar deneniyor...", flush=True)
        time.sleep(3 * (attempt + 1))
    sys.exit(f"Ses servisine ulasilamadi: {text[:60]}")


def build_scene(scene, target, speak):
    """Speaks each sentence separately and joins them with pauses; returns sentence timings."""
    frames, timings, params = [], [], None
    with tempfile.TemporaryDirectory() as directory:
        for index, sentence in enumerate(scene["sentences"]):
            part = Path(directory) / f"{index}.wav"
            speak(sentence, part)
            with wave.open(str(part)) as source:
                params = params or source.getparams()
                rate = source.getframerate()
                start = sum(len(f) for f in frames) / (rate * params.sampwidth * params.nchannels)
                data = source.readframes(source.getnframes())
            frames.append(data)
            end = start + len(data) / (rate * params.sampwidth * params.nchannels)
            timings.append({"start": round(start, 2), "end": round(end, 2)})
            frames.append(b"\0" * int(rate * PAUSE) * params.sampwidth * params.nchannels)
    target.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(target), "wb") as out:
        out.setparams(params)
        out.writeframes(b"".join(frames))
    duration = sum(len(f) for f in frames) / (params.framerate * params.sampwidth * params.nchannels)
    return {"duration": round(duration, 2), "sentences": timings}


def main():
    force = "--force" in sys.argv
    if "--piper" in sys.argv:
        assert PIPER.is_file(), f"Piper bulunamadi: {PIPER}"
        assert MODEL.is_file(), f"Ses modeli bulunamadi: {MODEL}"
        speak, voice = speak_piper, "piper tr_TR-dfki-medium"
    else:
        token = ses_token()
        if not token:
            sys.exit("SES_TOKEN yok: ortam degiskeni olarak ya da .env.datakey icine `SES_TOKEN=...` yazin "
                     "(ya da --piper ile yerel sesi kullanin).")
        speak, voice = (lambda text, target: speak_datakey(text, target, token)), "datakey-ses antalia-mini"
    names = [a for a in sys.argv[1:] if not a.startswith("--")]
    files = [LESSONS / f"{n}.json" for n in names] or sorted(
        p for p in LESSONS.glob("*.json") if not p.name.endswith(".audio.json"))
    for path in files:
        lesson = json.loads(path.read_text(encoding="utf-8"))
        manifest_path = LESSONS / f"{lesson['id']}.audio.json"
        manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.is_file() else {"scenes": {}}
        for scene in lesson["scenes"]:
            target = OUT / lesson["id"] / f"{scene['id']}.wav"
            known = manifest["scenes"].get(scene["id"])
            if not force and target.is_file() and known and len(known["sentences"]) == len(scene["sentences"]):
                print(f"{lesson['id']}/{scene['id']}: var, atlaniyor")
                continue
            print(f"{lesson['id']}/{scene['id']}: {len(scene['sentences'])} cumle uretiliyor...", flush=True)
            manifest["scenes"][scene["id"]] = build_scene(scene, target, speak)
            manifest["voice"] = voice
        manifest["duration"] = round(sum(s["duration"] for s in manifest["scenes"].values()), 2)
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{lesson['id']}: toplam {manifest['duration'] / 60:.1f} dakika -> {manifest_path.name}")


if __name__ == "__main__":
    main()
