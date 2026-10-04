"""40 ms energy envelope (dB) to find exact word boundaries.  usage: envelope.py audio16k.wav START END"""
import sys, numpy as np
from asr_common import load, rms_db
a, sr = load(sys.argv[1]); s, e = float(sys.argv[2]), float(sys.argv[3])
print(" ".join(f"{t:.2f}:{rms_db(a, sr, t, t + 0.04):.0f}" for t in np.arange(s, e, 0.04)))
