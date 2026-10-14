#!/bin/bash
# build.sh [workers] — queue every song whose strum survey found a pattern and has no passing output yet,
# then open a herdr tab "songs" with N panes (default 4), each running worker.sh.
P="$(cd "$(dirname "$0")" && pwd)"; N="${1:-4}"
mkdir -p "$P/queue"
awk -F'\t' '$2=="true"{print $1}' "$P/strum/SUMMARY.tsv" | while read s; do
  [ -f "$P/done/$s" ] || [ -f "$P/running/$s" ] || touch "$P/queue/$s"
done
echo "queued: $(ls "$P/queue" | wc -l | tr -d ' ')"
[ "${HERDR_ENV:-}" = 1 ] || { echo "not inside herdr; run workers by hand: $P/worker.sh 1"; exit 0; }
tab=$(herdr tab create --cwd "$P" --label songs --no-focus)
root=$(echo "$tab" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).result.root_pane.pane_id))')
panes=("$root")
right=$(herdr pane split "$root" --direction right --cwd "$P" --no-focus | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).result.pane.pane_id))')
[ "$N" -ge 2 ] && panes+=("$right")
[ "$N" -ge 3 ] && panes+=("$(herdr pane split "$root" --direction down --cwd "$P" --no-focus | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).result.pane.pane_id))')")
[ "$N" -ge 4 ] && panes+=("$(herdr pane split "$right" --direction down --cwd "$P" --no-focus | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).result.pane.pane_id))')")
i=0; for p in "${panes[@]}"; do i=$((i+1)); herdr pane rename "$p" "song worker $i" >/dev/null; herdr pane run "$p" "$P/worker.sh $i" >/dev/null; sleep 2; done
echo "herdr tab 'songs': ${#panes[@]} workers started (${panes[*]})"
