#!/bin/bash
# Election night: refresh results.json and push it to main every INTERVAL seconds (default 900 = 15 minutes).
# Run from anywhere:  bash tools/election_loop.sh        Stop with Ctrl-C (or kill the process).
cd "$(dirname "$0")/.." || exit 1
INTERVAL=${INTERVAL:-900}
while true; do
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="
  git pull -q --rebase origin main || echo "pull failed; continuing"
  if python3 tools/election_results.py; then
    git add articles/on-the-road/results/results.json
    if ! git diff --cached --quiet; then
      git commit -q -m "Election night results $(date '+%H:%M')" && (git push -q origin main || echo "push failed")
    else
      echo "no change"
    fi
  else
    echo "results fetch failed; keeping the last results.json"
  fi
  sleep "$INTERVAL"
done
