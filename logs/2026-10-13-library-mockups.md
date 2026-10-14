# 2026-10-13 — Song library: three mockups

Carlos: "turn this into a library of songs, 3 mockups with options".

- **Built** `mockups/library/` (untracked, nothing committed): `a.html` **Shelf** (search, filter chips, tracks kept as "Paths" playlists, card grid, slide-in song sheet), `b.html` **Catalogue** (sortable table with Chords/Licks/Timing bars, difficulty cap, practise-focus sort, style/decade filters, sticky detail panel that becomes a bottom sheet on phones), `c.html` **Repertoire** (Today card resuming the in-progress session, streak and goal, Up next / Learning (max 2) / Can play end to end board with a "due a run-through" nudge, add-songs list defaulting to the 2.0–3.3 sweet spot from songs.md).
- Shared `common.css` / `common.js`; `data.js` generated from the songs.md candidate pool (57 songs) joined to `TRACKS` (10 ready, 20 queued, 27 candidates). The Guitar/Guitarlele toggle works in all three (keys and chord chips go a 4th down).
- Existing `mockup-a/b/c.html` at the root were left alone.
- **Verified** with headless Chrome (the extension was not connected): desktop at 1360px, phone at 375px inside an iframe (no horizontal scroll on any of the three), and scripted clicks for search, filters, sort, guitarlele transposition, row select, and board moves. One fix came out of it: C's Today card now picks the learning song furthest into its session.
- **INBOX:** the 2026-09-16 `memoryPalace` message, done. Both premises added to `MEMORY.md`.
- **Memory Palace:** unreachable (ssh to macbook-pro-2015 timed out); no brief this session.

## 2026-10-14 — Concept C built into the app

Carlos: "Lets go with C as you suggest" (C as home, A's search/grid for browsing).

- **index.html:** library home with Today, practice streak + 14-day calendar + editable goal, Repertoire board (Up next / Learning max 2 / Can play end to end), and Library (search, status/level/style filters, Paths). Hash routing `#/` and `#/song/<id>`. Track and week selectors removed; the 🥁 Trainer link moved to the top bar. Each step has Mark done. The session header has a repertoire row.
- **Data:** `tags` added to all 30 sessions and a `CANDIDATES` array (27 songs, incl. the uncommitted Love is the Drug row in songs.md), both generated from songs.md. One `Progress` object writes `guitarProgress`.
- **Decided without asking** (said so in chat): tracks kept as Paths; progress in localStorage, no sync.
- **Verified** headless (extension still not connected): no console errors; scripted flow (seed, open song, mark 1 then 5 steps → part then full day and streak 1, Learning limit, Got it → playable with today's date, + Up next from a card, candidate opens Coming soon, guitarlele keys in both views, search/path/level filters, reload keeps progress). Library 375px: no overflow. Session 375px overflows by 27px, which predates this (the old page was 31px over); added to BACKLOG.
- Committed `0ea3fc8` and pushed on Carlos's go-ahead; live on guitar.ag-insights.co.uk about 20s later, rendered headless with no errors. `songs.md` (Love is the Drug row) and `mockups/` left uncommitted.

## 2026-10-14 — 21 rock en español songs

Carlos asked for rock en español classics plus popular Calamaro songs, then added Copa rota ("Lets do 21 - no replacements") after noticing he loves the B7 in Flaca and Copa rota.

- **songs.md:** 21 rows in the candidate pool, placed by score, tagged `rock en español` (+ `calamaro` for his solo songs, Los Rodríguez and Los Abuelos de la Nada); a note on where keys came from.
- **Keys:** from LaCuerda / Ultimate Guitar chord charts (a subagent fetched 13 of them). Only Lamento boliviano's chart states a key; the rest are read from the progressions. Devuélveme a mi chica has charts in three keys (D minor used, most-voted). Mariposa tecknicolor corrected to 1994. Copa rota's year not found, left unknown. Ratings are estimates from the charts.
- **index.html:** `CANDIDATES` regenerated from songs.md (48 candidates, 78 songs total). Year made optional; accent-insensitive search; accents folded in song ids.
- **Verified** headless: 78 songs, no console errors, tag chips, "calamaro" finds 8, "musica ligera" / "devuelveme" match, unknown year sorts last, guitarlele keys (Copa rota → B minor shapes), all 78 ids unique.
