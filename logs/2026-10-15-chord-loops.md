# 2026-10-15 — Chord loops

Carlos noticed several songs share a chord pattern. Analysis of the 70 charts with sections found shared progressions (i–♭VII in Horse With No Name / Come as You Are / Smoke on the Water / Oye mi amor; I–V–IV in Knockin', Here I Go Again, More Than a Feeling, Crazy Train; …). Three uses were mocked on a design canvas: "same loop as…" on the song page, Paths by chord loop + a loop page, and the Beginner path reordered by loop. He liked all three but cut the song-page one down to a label: no moving song to song from song pages.

- **index.html:** `songLoops()` / `getLoopFamilies()` compute loops from the charts (degrees of `key`, rotations merged, 2–4 chords). 72 of 78 songs have a loop; 25 loops are shared by ≥2 songs.
- Song page: `Loop` chip in the header (most-played loop) and up to 3 loop lines under the step 4 diagrams, chords following the instrument toggle.
- Library: Paths switch **By difficulty / By chord loop**; loop cards (numerals, name, example, song count, where the songs sit); picking one filters the grid and adds a `Loop` pill to each card; search matches loop numerals and names.
- `#/loop/<id>`: the loop as boxes, a strummed Web Audio loop player at the picked song's BPM (highlights the current chord), song picker, table of every song using it (easiest first, opens the song map), related loops.
- Beginner path reordered (see MEMORY.md); `songs.md` programme table updated.
- **Verified** in headless Chromium on localhost:7432: loop mode, card filter, About this loop, player start/stop and highlight, picking another song, leaving the page stops the player, guitarlele shapes on song page and loop page, unknown loop id falls back to the library, 375px width with no sideways scroll, no console errors.
- Pushed to `claude/sweet-noether-411x5n`, not `main`: not deployed.
