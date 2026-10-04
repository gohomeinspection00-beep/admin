#!/usr/bin/env bash
# Deliverable copy. Bitrate is derived from the duration so every video lands near ~19 MB
# (SendUserFile fails around 50 MB; short videos get much more bitrate = sharper), capped at 8 Mbps.
# Audio is normalised to -13 LUFS (HyperFrames' mixer lands near -16; Reels/TikTok sit around -13/-14).
# usage: share.sh render.mp4 share.mp4
set -euo pipefail
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$1")
VK=$(python3 -c "d=float('$DUR'); print(int(min(8000, max(1500, (19*8*1024)/d - 160))))")
ffmpeg -v error -y -i "$1" -c:v libx264 -preset slow -b:v ${VK}k -maxrate $((VK*3/2))k -bufsize $((VK*2))k \
  -pix_fmt yuv420p -movflags +faststart \
  -af "loudnorm=I=-13:TP=-1.2:LRA=8,alimiter=limit=0.89:level=false" -c:a aac -b:a 160k -ar 48000 "$2"
echo "video bitrate ${VK}k for ${DUR}s"
ffmpeg -i "$2" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "^\s+I:" || true
ls -la "$2"
