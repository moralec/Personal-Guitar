#!/bin/bash
# survey.sh — step 1: look for an Ultimate Guitar strumming pattern for every unbuilt song.
# Writes pipeline/strum/<slug>.json and a summary pipeline/strum/SUMMARY.tsv. Songs with no pattern are skipped later.
cd "$(dirname "$0")/.." || exit 1
mkdir -p pipeline/strum
node pipeline/songs.js > pipeline/strum/songs.tsv
: > pipeline/strum/SUMMARY.tsv
while IFS=$'\t' read slug title artist year key where; do
  [ -s "pipeline/strum/$slug.json" ] && grep -q '"found":true' "pipeline/strum/$slug.json" || \
    node strum-from-ug.js --json --search "$title" "$artist" > "pipeline/strum/$slug.json" 2>/dev/null
  found=$(grep -o '"found":[a-z]*' "pipeline/strum/$slug.json" | head -1 | cut -d: -f2)
  printf '%s\t%s\t%s\t%s\n' "$slug" "${found:-error}" "$where" "$title — $artist" | tee -a pipeline/strum/SUMMARY.tsv
  sleep 1.5
done < pipeline/strum/songs.tsv
