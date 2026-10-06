#!/usr/bin/env bash
# Defect series final video: clean footage only (no text, NO thumbnail inside), sound OFF, 1080x1920 30fps.
# The thumbnail PNG is delivered as a SEPARATE file for the cover (client rule, 2026-10-06).
# usage: make_video.sh footage.mp4 out.mp4 [start_s] [end_s]   (start/end trim to the defect reveal)
set -euo pipefail
CLIP="$1"; OUT="$2"; SS="${3:-0}"; TO="${4:-}"
# shorter side < 1080 (phone 720p, any rotation) -> upscale + sharpen
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$CLIP" | head -1 | tr -d ',' | tr 'x' '\n' | grep -E '^[0-9]+$' | sort -n | head -1)
SHARP=""; [ "$W" -lt 1080 ] && SHARP=",hqdn3d=1.2:1.2:2:2,cas=strength=0.55"
TRIM=(-ss "$SS"); [ -n "$TO" ] && TRIM+=(-to "$TO")
ffmpeg -v error -y "${TRIM[@]}" -i "$CLIP" \
  -vf "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920$SHARP,setsar=1,format=yuv420p,fps=30" \
  -af "volume=0" -c:v libx264 -preset slow -b:v 8000k -maxrate 12000k -bufsize 16000k -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"
