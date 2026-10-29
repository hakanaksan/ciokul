"""Piper ile video derslerin seslerini ve cümle zamanlarını üretir (offline).

Kullanim:  Codex python ile `generate_lesson_audio.py [fosiller ...]` (adsiz = sesi eksik dersler)
           `--force` var olan sesleri de yeniden uretir.
Cikti:     lesson_audio/<ders>/<sahne>.wav (22050 Hz mono WAV) ve lessons/<ders>.audio.json
           (sahne suresi ve her cumlenin baslangic/bitis saniyesi; altyazi ve sahne adimlari icin).
Gereken:   tools/piper/piper/piper.exe + tools/piper/voices/tr_TR-dfki-medium.onnx
Sesler depoya `upload_files.py --only lesson_audio/` ile yuklenir.
"""
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

BASE = Path(__file__).resolve().parent
PIPER = BASE / "tools" / "piper" / "piper" / "piper.exe"
MODEL = BASE / "tools" / "piper" / "voices" / "tr_TR-dfki-medium.onnx"
LESSONS = BASE / "lessons"
OUT = BASE / "lesson_audio"
PAUSE = 0.45          # seconds between sentences
LENGTH_SCALE = "1.12"  # a little slower than normal, for 9-10 year olds


def speak(text, target):
    proc = subprocess.run([str(PIPER), "-m", str(MODEL), "-f", str(target), "--length_scale", LENGTH_SCALE, "-q"],
                          input=text, capture_output=True, text=True, encoding="utf-8")
    if proc.returncode != 0 or not target.is_file():
        sys.exit(f"Piper hatasi: {text[:60]}\n{proc.stderr[-1500:]}")


def build_scene(scene, target):
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
            manifest["scenes"][scene["id"]] = build_scene(scene, target)
        manifest["duration"] = round(sum(s["duration"] for s in manifest["scenes"].values()), 2)
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"{lesson['id']}: toplam {manifest['duration'] / 60:.1f} dakika -> {manifest_path.name}")


if __name__ == "__main__":
    assert PIPER.is_file(), f"Piper bulunamadi: {PIPER}"
    assert MODEL.is_file(), f"Ses modeli bulunamadi: {MODEL}"
    main()
