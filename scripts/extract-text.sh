#!/usr/bin/env bash
# Extract plain text from corpus/pdf/*.pdf into corpus/text/*.txt with
# `pdftotext -layout` (poppler). Line numbers in skills/imac-style/references/sources.md
# refer to this output.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
command -v pdftotext >/dev/null || { echo "pdftotext not found; install poppler (brew install poppler)" >&2; exit 1; }
mkdir -p "$root/corpus/text"
for pdf in "$root"/corpus/pdf/*.pdf; do
  txt="$root/corpus/text/$(basename "${pdf%.pdf}").txt"
  [[ -s "$txt" ]] || pdftotext -layout "$pdf" "$txt" &
done
wait
ls "$root"/corpus/text/*.txt | wc -l | xargs echo "text files:"
