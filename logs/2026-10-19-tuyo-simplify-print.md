# 2026-10-19 — Tuyo siempre simplified; print sheet

**Tuyo siempre**, by ear from the Estudio Satori lesson (Carlos):
- No plain E: the V chord is E7 for the whole bar; turnaround F–E7; pre-chorus ends on E7.
- The pre-chorus's B7–F bar is Dm: Dm–G · C–F · Dm · E7. No B7 in the song.
- The lesson plays F as Fmaj7 (xx3210); the app had no Fmaj7 diagram, now added. Guitarlele side: Cmaj7, already there.
- Intro, verse, chorus and interlude are one progression, now one section (`Verse / Chorus`) used by six parts of the order. The intro grew from the pipeline's guessed 4 bars to 8, which removed the song's only 2–4 chord cycle: it no longer shows a Loop chip or sits on the i–iv–♭VII–♭III loop page.
- Chords: Am Dm G C E7 Fmaj7 (guitarlele Em Am D G B7 Cmaj7), no barres. MEMORY's 2026-10-16 note superseded, not edited.
- Commit 1 of 2. Edited via `pipeline/out/tuyo-siempre.json` → check.js (PASS, usual channel WARN) → assemble.js.

**Print sheet** (Carlos: "one page, landscape, two columns, so I can fold it in half"):
- `🖨 Print chords` on the song page's repertoire row (songs with chords); Cmd+P on a song page gives the same.
- `chordsForInstrument` and `keyForInstrument` take an optional instrument, so both halves render without touching the toggle.
- Black ink, grey cells, dashed fold line, 10 mm margins per half; long songs zoom down to fit, both halves by the same factor.
- **Verified** with headless Chrome `--print-to-pdf`: 1 page each for Tuyo siempre, Entre dos tierras (longest chart, shrinks and fills the page) and Summer of '69 (legacy `structure` format); button screenshot on the song page. **Not checked:** a real printer, Safari/Firefox print, the on-screen guitarlele toggle after the helper change (the print's guitarlele half exercises the same path).
- Commit 2 of 2; both pushed to `main`.
