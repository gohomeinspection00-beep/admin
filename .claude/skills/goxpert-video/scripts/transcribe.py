"""Sentence-level transcript with VAD timing.  usage: transcribe.py audio16k.wav out.json"""
import sys, json, os, sherpa_onnx
from asr_common import recognizer, load, MODELS

a, sr = load(sys.argv[1])
rec = recognizer()
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = os.path.join(MODELS, "silero_vad.onnx")
cfg.silero_vad.min_silence_duration = 0.25
cfg.silero_vad.min_speech_duration = 0.2
cfg.silero_vad.threshold = 0.45
cfg.silero_vad.max_speech_duration = 12
cfg.sample_rate = sr
vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=600)
w = cfg.silero_vad.window_size
segs = []
for i in range(0, len(a), w):
    vad.accept_waveform(a[i:i + w])
    while not vad.empty():
        segs.append((vad.front.start / sr, len(vad.front.samples) / sr)); vad.pop()
vad.flush()
while not vad.empty():
    segs.append((vad.front.start / sr, len(vad.front.samples) / sr)); vad.pop()
out = []
for st, du in segs:
    from asr_common import decode
    t = decode(rec, a, sr, st, st + du)
    out.append({"start": round(st, 2), "end": round(st + du, 2), "text": t})
    print(f"[{st:7.2f}-{st + du:7.2f}] {t}", flush=True)
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
