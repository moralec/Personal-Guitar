#!/bin/bash
# worker.sh <n> — runs in a herdr pane: claims songs from queue/ one at a time until it is empty.
P="$(cd "$(dirname "$0")" && pwd)"; mkdir -p "$P/running" "$P/done" "$P/failed"
while true; do
  next=$(ls "$P/queue" 2>/dev/null | head -1); [ -z "$next" ] && break
  mv "$P/queue/$next" "$P/running/$next" 2>/dev/null || continue     # another worker took it
  if "$P/run-one.sh" "$next"; then mv "$P/running/$next" "$P/done/"; else mv "$P/running/$next" "$P/failed/"; fi
done
printf '\n\033[1;32m■ worker %s: queue empty\033[0m\n' "$1"
