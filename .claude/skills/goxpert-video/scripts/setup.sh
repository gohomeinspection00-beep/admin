#!/usr/bin/env bash
# One-time setup per session: HyperFrames skills, local Malay ASR (Whisper turbo via sherpa-onnx), VAD.
# huggingface.co is blocked in this environment; GitHub release assets are reachable.
set -euo pipefail
MODELS="${GOXPERT_MODELS:-/tmp/goxpert-models}"
mkdir -p "$MODELS"
[ -d "$HOME/.claude/skills/hyperframes" ] || npx -y skills add heygen-com/hyperframes -g -a claude-code -s '*' -y
pip install --quiet sherpa-onnx soundfile numpy 2>/dev/null || pip install sherpa-onnx soundfile numpy
if [ ! -f "$MODELS/sherpa-onnx-whisper-turbo/turbo-encoder.int8.onnx" ]; then
  curl -sSL -o "$MODELS/turbo.tar.bz2" https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-turbo.tar.bz2
  tar xjf "$MODELS/turbo.tar.bz2" -C "$MODELS" && rm "$MODELS/turbo.tar.bz2"
fi
[ -f "$MODELS/silero_vad.onnx" ] || curl -sSL -o "$MODELS/silero_vad.onnx" https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/silero_vad.onnx
echo "ready: $MODELS"
