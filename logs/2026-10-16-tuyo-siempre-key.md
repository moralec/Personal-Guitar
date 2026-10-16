# 2026-10-16 — Tuyo siempre moved to A minor

Carlos: the lesson video plays Am Dm G C / E7 F, and the app had the song in E minor (a 4th lower, which is what the guitarlele now shows).

- The video's chords are the old chart up a 4th. LaCuerda has an A-minor version (acordes.lacuerda.net/andres_calamaro/tuyo_siempre.shtml: LAm REm SOL DO MI MI7 FA SI7); the chart now follows it. Beyond the transposition: the verse's V bar is E then E7 (2 beats each), and the pre-chorus ends B7 → F → E (the Em chart had F → B7 → Em there; its F stood for F#7).
- Edited `pipeline/out/tuyo-siempre.json` (key, chords, chart_url → LaCuerda Am, warmup text, a HAND FIX note), re-ran check.js (all PASS; lesson channel WARN is the known Eliana De Piero name) and assemble.js: only the tuyo-siempre BUILT line changed. `CANDIDATES` key and songs.md row/note → A minor.
- Guitar chords: Am Dm G C E E7 F B7. Guitarlele: Em Am D G B B7 C F#7, all with diagrams. Loop label unchanged (i – iv – ♭VII – ♭III).
- **Verified** in headless Chrome (extension not connected), file:// `#/song/tuyo-siempre`: Key A minor, step 3 diagrams, song map bars. Not played by ear: the B7 in the pre-chorus is from LaCuerda, not from Carlos's video list.
