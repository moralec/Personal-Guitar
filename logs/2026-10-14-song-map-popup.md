# 2026-10-14 — Song map pop-up in the library

Carlos: clicking a song should open "the song map" for jamming on songs he already knows, not the training session. Kept deliberately small: "Title, artist, song order strip and section grids."

- **index.html:** library song cards and Repertoire board items (thumb + title) now call `openMap(id)` → a pop-up with title, artist, the Song Order strip and the section grids (follows the Guitar/Guitarlele toggle), **▶ Start practice** (opens `#/song/<id>` as before) and ✕ / Esc / tap outside to close. No URL, nothing marked done. The Today card still goes straight into the session.
- **Refactor:** step 4's strip + grid code moved into `songMapHtml(data, colors)` + `chordColors(data)`, shared by step 4 and the pop-up. `highlightSection(chip)` is now scoped to the map the chip is in (`.song-map`, blocks keyed by `data-key` instead of `id="csec-…"`), so the two maps don't collide. Legacy `structure`/`grid` songs render their old layout in the pop-up.
- **Verified** in Chrome on localhost:7432: pop-up for Every Rose (11 chips, 5 sections), chip highlight, Esc, backdrop click, legacy song, Start practice → session, step 4 still renders and highlights, no console errors.
- **Memory Palace:** unreachable (ssh to macbook-pro-2015 timed out); no brief. INBOX: nothing new.
- Committed `741d7fc` and pushed on Carlos's "deploy"; live about 20s later, pop-up checked on guitar.ag-insights.co.uk (Brain Stew, 9 chips).
