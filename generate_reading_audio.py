"""Piper ile okuma gecitlerinin seslerini uretir (offline, neural, otomatik).

Kullanim:  Codex python ile `generate_reading_audio.py [01 02 ...]` (numarasiz = eksikler)
Cikti:     reading_audio/R01.wav ... (22050 Hz mono WAV, tarayici dogrudan calar)
Gereken:   tools/piper/piper/piper.exe + tools/piper/voices/tr_TR-dfki-medium.onnx
"""
import json
import subprocess
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
PIPER = BASE / "tools" / "piper" / "piper" / "piper.exe"
MODEL = BASE / "tools" / "piper" / "voices" / "tr_TR-dfki-medium.onnx"
OUT = BASE / "reading_audio"


def main():
    only = {int(a) for a in sys.argv[1:]} or None
    passages = json.loads((BASE / "data" / "reading_passages.json").read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    for item in passages:
        sec = item["section"]
        if only and sec not in only:
            continue
        target = OUT / f"R{sec:02}.wav"
        if target.is_file():
            print(f"R{sec:02}: var, atlaniyor ({target.stat().st_size // 1024} KB)")
            continue
        print(f"R{sec:02}: uretiliyor ({item['chars']} karakter)...", flush=True)
        proc = subprocess.run(
            [str(PIPER), "-m", str(MODEL), "-f", str(target),
             "--sentence_silence", "0.3", "-q"],
            input=item["text"], capture_output=True, text=True, encoding="utf-8")
        if proc.returncode != 0 or not target.is_file():
            print(f"R{sec:02}: HATA\n{proc.stderr[-2000:]}")
            target.unlink(missing_ok=True)
            sys.exit(1)
        print(f"R{sec:02}: tamam ({target.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    assert PIPER.is_file(), f"Piper bulunamadi: {PIPER}"
    assert MODEL.is_file(), f"Ses modeli bulunamadi: {MODEL}"
    main()
