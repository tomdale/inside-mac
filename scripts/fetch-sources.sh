#!/usr/bin/env bash
# Download the Inside Macintosh PDFs listed in sources.txt into corpus/pdf/.
# The PDFs are Apple's copyrighted works. They are fetched for private study
# and are never committed to this repository (corpus/ is gitignored).
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/corpus/pdf"
mkdir -p "$out"
grep -v '^#' "$root/scripts/sources.txt" | grep -v '^$' | while read -r url; do
  name="$(basename "${url//%26/&}")"
  if [[ -s "$out/$name" ]]; then echo "skip  $name"; continue; fi
  echo "fetch $name"
  curl -fsSL -o "$out/$name.part" "$url" && mv "$out/$name.part" "$out/$name"
done
echo "PDFs in $out: $(ls "$out"/*.pdf | wc -l | tr -d ' ')"
