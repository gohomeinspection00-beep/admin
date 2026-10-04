"""Re-transcribe planned keep-ranges to confirm clean in/out points.
usage: verify.py audio16k.wav '[[4.38,7.35],[8.28,15.0]]'"""
import sys, json
from asr_common import recognizer, load, decode

a, sr = load(sys.argv[1]); rec = recognizer()
for s, e in json.loads(sys.argv[2]):
    print(f"[{s:7.2f}-{e:7.2f}] {decode(rec, a, sr, s, e)}", flush=True)
