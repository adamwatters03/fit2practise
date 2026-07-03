#!/usr/bin/env bash
#
# Fetch the real Fit to Practise brand images from the live WordPress site and
# drop them into assets/img/, replacing the committed placeholder graphics.
#
# The repo currently ships with lightweight, brand-coloured PLACEHOLDER images
# because the build environment could not reach fit2practise.com. Run this once
# from a machine (or CI) that can reach the site to pull in the genuine photos.
#
#   bash scripts/fetch-images.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."
DEST="assets/img"
mkdir -p "$DEST"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
BASE="https://fit2practise.com/wp-content/uploads"

get() { # url dest
  echo "→ $2"
  curl -fsSL -A "$UA" -H "Referer: https://fit2practise.com/" "$1" -o "$DEST/$2"
}

get "$BASE/2025/03/F2P-logo-09-2.png"                              "F2P-logo-09-2.png"
get "$BASE/2025/04/F2P-logo-08-2.png"                              "F2P-logo-08-2.png"
get "$BASE/2026/03/Nurse-Smiling-750x500.jpg"                      "Nurse-Smiling-750x500.jpg"
get "$BASE/2025/07/Code-of-Conduct-750x500.jpg"                    "Code-of-Conduct-750x500.jpg"
get "$BASE/2025/04/Reflection-Writing-1-750x500.jpg"              "Reflection-Writing-1-750x500.jpg"
get "$BASE/2025/04/Rebuilding-Confidence-750x500.jpg"            "Rebuilding-Confidence-750x500.jpg"
get "$BASE/2025/06/Healthcare-professional-on-laptop-750x500.jpg" "Healthcare-professional-on-laptop-750x500.jpg"
get "$BASE/2025/09/Healthcare-Professional-on-Laptop.jpg"         "Healthcare-Professional-on-Laptop.jpg"
get "$BASE/2025/09/Group-Brainstorming-Graphic-2.jpg"            "Group-Brainstorming-Graphic-2.jpg"
get "$BASE/2025/09/Reflection-Writing-1.jpg"                      "Reflection-Writing-1.jpg"
get "$BASE/2025/03/cathryn.jpg"                                    "cathryn.jpg"
get "$BASE/2025/02/coach-choose2.jpg"                              "coach-choose2.jpg"
get "$BASE/2025/05/Simon-Holborn.jpg"                              "Simon-Holborn.jpg"
get "$BASE/2025/05/Kenny-Headshot.jpg"                            "Kenny-Headshot.jpg"
get "$BASE/2025/05/Maria-Headshot.jpg"                            "Maria-Headshot.jpg"
get "$BASE/2025/06/Ruth-Headshot.jpg"                              "Ruth-Headshot.jpg"

echo "Done. Real brand images are now in $DEST/"
