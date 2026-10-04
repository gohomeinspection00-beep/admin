import os, sherpa_onnx, soundfile as sf, numpy as np

MODELS = os.environ.get("GOXPERT_MODELS", "/tmp/goxpert-models")

def recognizer():
    m = os.path.join(MODELS, "sherpa-onnx-whisper-turbo")
    return sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{m}/turbo-encoder.int8.onnx", decoder=f"{m}/turbo-decoder.int8.onnx",
        tokens=f"{m}/turbo-tokens.txt", language="ms", task="transcribe", num_threads=4)

def load(path):
    a, sr = sf.read(path, dtype="float32")
    if a.ndim > 1:
        a = a.mean(1)
    assert sr == 16000, "extract audio first: ffmpeg -i in.mp4 -ac 1 -ar 16000 audio.wav"
    return a, sr

def decode(rec, a, sr, s, e):
    st = rec.create_stream()
    st.accept_waveform(sr, a[int(s * sr):int(e * sr)])
    rec.decode_stream(st)
    return st.result.text.strip()

def rms_db(a, sr, s, e):
    x = a[int(s * sr):int(e * sr)]
    return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
