#!/usr/bin/env bash
# Speech clean-up approved by the client: RNNoise + light FFT denoise + fast gate + compressor + loudnorm.
# Do NOT make it harsher: stronger afftdn/slow gate ate "tr" consonants ("tribunal" -> "Sri Buna").
# usage: clean_audio.sh in.mp4 out.mp4 [copy|x264]   (x264 also bakes rotation into pixels)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
RNN="$HERE/../assets/sh.rnnn"
AF="highpass=f=90,arnndn=m=$RNN:mix=1,afftdn=nf=-33,agate=threshold=0.003:ratio=4:range=0.1:attack=1:release=350,acompressor=threshold=-24dB:ratio=3.5:attack=5:release=120:makeup=4,loudnorm=I=-13:TP=-1.5:LRA=7"
if [ "${3:-copy}" = "copy" ]; then V="-c:v copy"; else V="-c:v libx264 -crf 16 -preset medium -pix_fmt yuv420p"; fi
ffmpeg -v error -y -i "$1" $V -af "$AF" -c:a aac -b:a 192k -ar 48000 "$2"
