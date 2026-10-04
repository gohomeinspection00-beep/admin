#!/usr/bin/env bash
# Deliverable copy: ~21 MB for 100 s (SendUserFile fails around 50 MB) + final loudness -13 LUFS
# (HyperFrames' mixer lands near -16 LUFS; Reels/TikTok sit around -13/-14).
# usage: share.sh render.mp4 share.mp4
set -euo pipefail
ffmpeg -v error -y -i "$1" -c:v libx264 -preset slow -crf 26 -maxrate 1.6M -bufsize 3.2M -pix_fmt yuv420p \
  -movflags +faststart -af "loudnorm=I=-13:TP=-1.2:LRA=8,alimiter=limit=0.89:level=false" -c:a aac -b:a 160k -ar 48000 "$2"
ffmpeg -i "$2" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "^\s+I:" || true
ls -la "$2"
