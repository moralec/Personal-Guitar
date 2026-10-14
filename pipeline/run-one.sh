#!/bin/bash
# run-one.sh <slug> — one DeepSeek (opencode-go) session researches one song → out/<slug>.json, then check.js.
set -u
P="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(dirname "$P")"; SLUG="$1"
MODEL="${MODEL:-opencode-go/deepseek-v4.1-flash}"
IFS=$'\t' read -r _ TITLE ARTIST YEAR KEY WHERE < <(awk -F'\t' -v s="$SLUG" '$1==s' "$P/strum/songs.tsv")
STRUM="$P/strum/$SLUG.json"
CHART=$(node -e 'const j=require(process.argv[1]);console.log(j.found&&j.url||"")' "$STRUM" 2>/dev/null)
# No strumming pattern on UG: the session ships without the strumming step; the model picks the chart itself
[ -z "$CHART" ] && CHART="none chosen yet (no chart with a strumming pattern exists): pick the best-rated public chords page yourself, Ultimate Guitar or LaCuerda.net"
BPM=$(node -e 'const j=require(process.argv[1]);console.log((j.pick||{}).bpm||"unknown")' "$STRUM" 2>/dev/null || echo unknown)
OUT="$P/out/$SLUG.json"; W="$P/work/$SLUG"; mkdir -p "$P/out" "$W"
node -e '
const [tpl, ...v] = process.argv.slice(1); const k = ["TITLE","ARTIST","YEAR","KEY","CHART_URL","BPM_HINT","OUT"];
let s = require("fs").readFileSync(tpl, "utf8"); k.forEach((x, i) => s = s.split("{{" + x + "}}").join(v[i])); process.stdout.write(s);
' "$P/prompt.md" "$TITLE" "$ARTIST" "${YEAR:-unknown}" "$KEY" "$CHART" "$BPM" "$OUT" > "$W/prompt.txt"
printf '\n\033[1;33m▶ %s — %s\033[0m  (%s · %s)\n\n' "$TITLE" "$ARTIST" "$WHERE" "$MODEL"
start=$(date +%s)
( cd "$W" && opencode run --auto -m "$MODEL" --title "guitar-$SLUG" "$(cat prompt.txt)" 2>&1 | tee run.log )
secs=$(( $(date +%s) - start ))
if [ -s "$OUT" ]; then
  node "$P/check.js" "$OUT" "$ROOT/index.html" "$STRUM" > "$P/out/$SLUG.check.txt" 2>&1; rc=$?
else
  echo "FAIL no output file written" > "$P/out/$SLUG.check.txt"; rc=1
fi
cat "$P/out/$SLUG.check.txt"
printf '%s\t%s\t%s\t%ss\n' "$SLUG" "$([ $rc = 0 ] && echo pass || echo fail)" "$(grep -c '^WARN' "$P/out/$SLUG.check.txt") warn" "$secs" >> "$P/out/RESULTS.tsv"
exit $rc
