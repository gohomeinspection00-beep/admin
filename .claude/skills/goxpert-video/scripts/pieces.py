"""Fine timed pieces split at energy gaps (for cut points + caption timing).
usage: pieces.py audio16k.wav START END"""
import sys, numpy as np
from asr_common import recognizer, load, decode

a, sr = load(sys.argv[1]); S, E = float(sys.argv[2]), float(sys.argv[3])
w = int(0.05 * sr)
r = np.array([20 * np.log10(np.sqrt(np.mean(a[i * w:(i + 1) * w] ** 2)) + 1e-9) for i in range(len(a) // w)])
thr = np.percentile(r, 30) - 2
gaps, s = [], None
for i, v in enumerate(r):
    if v < thr:
        s = i if s is None else s
    else:
        if s is not None and i - s >= 2:
            gaps.append((s * 0.05, i * 0.05))
        s = None
cuts = [S] + [(g0 + g1) / 2 for g0, g1 in gaps if S + 0.6 < (g0 + g1) / 2 < E - 0.6] + [E]
m = [cuts[0]]
for c in cuts[1:]:
    if c - m[-1] < 0.9 and c != E:
        continue
    m.append(c)
print("gaps>=0.25s:", " ".join(f"{g0:.2f}-{g1:.2f}" for g0, g1 in gaps if S <= g0 <= E and g1 - g0 >= 0.25))
rec = recognizer()
for s, e in zip(m[:-1], m[1:]):
    print(f"[{s:7.2f}-{e:7.2f}] {decode(rec, a, sr, s, e)}", flush=True)
