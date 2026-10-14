# MEMORY.md — guitar

Decisions that constrain new code, corrections received, gotchas. Rewritten as state changes; history is in `logs/`.

## Premises

- **Who the player is:** Carlos has played casually for ~15 years and calls himself intermediate, even beginner. His two stated gaps are **discipline** and **a repertoire of songs he can play end to end**, not theory or technique. Every feature is judged against that. (From the `memoryPalace` INBOX, 2026-09-16.)
- **Tabs a semitone low:** when an Ultimate Guitar tab is written in flats (`Gb`/`Badd9` rather than `G`/`Cadd9`), keep the tab's sequence, write the chords in the played key, and set `defaultPitch: 1` so the player matches. Happened on the first two songs; Carlos framed the second as "just like the previous one".

## Architecture

- One file, `index.html`. Two views switched by hash routing in `route()`: `#/` library, `#/song/<id>` session. `id` is `slug(title)`. `SONGS` flattens `TRACKS` + `CANDIDATES`, tagging each session object with `id`, `track`, `week`; `currentSession()` returns `currentSong`.
- Persistence: `guitarProgress` (the `Progress` object, the only writer), `guitarSong`, `guitarInstrument`. `guitarTrack` / `guitarWeekV2` are legacy, read only by `Progress.seed()` on first run.
- Rendering a song is `showSong()` → `renderSession()`, `renderBtGrid()`, `resetPlayer()`; it runs only when the song changes (`renderedSong`), so going back to the library and returning keeps a loaded play-along file. `leaveSession()` stops the backing, pauses play-along and swaps YouTube embeds back to thumbnails. Coming-soon songs hide `#stepsSection` but leave the previous DOM inside it.
- Library CSS names must not collide with existing app classes: `.today` is the Today/Practice row, and reusing it on a calendar square once blew the calendar out of its card.
- Chord diagrams are generated SVG from `CHORD_SHAPES` (`frets[6]`, -1 = muted, optional `barre`). A chord with no shape renders nothing, with no warning.
- Play-along uses `AudioBufferSourceNode`; pitch shift via SoundTouchJS from jsDelivr, falling back to direct playback if the import fails. `defaultPitch` per session presets the slider (Every Rose and Knockin' are +1: recorded a semitone flat of the shapes).
- Backing pattern: `kick[16]` and `snare[16]`; snare values between 0 and 1 render as ghost notes at that opacity. UI labels are Beat / Strum.

## Instrument toggle (2026-09-16)

- Guitarlele is A D G C E A: a guitar capo'd at the 5th fret. Same shapes, sounding a 4th higher. In guitarlele mode `chordsForInstrument()` transposes every chord name by `INSTRUMENTS.guitarlele.offset` (-5) before rendering; the header shows `Guitarlele shapes: <key>` via `keyForInstrument()`.
- `transposeChord()` parses root / suffix / slash bass and spells the result with whichever of default, sharp, flat exists in `CHORD_SHAPES`. Minor keys spell to match the `m` chord (C# minor → G# minor, not Ab).
- Header shows one key chip, labelled `Key` (guitar) or `Shapes` (guitarlele). **Carlos's correction:** showing both Key and Guitarlele shapes side by side was rejected.
- `rating: { chords, licks, timing }` on every session comes from songs.md. `difficultyFor()` averages them with Chords shifted by `barreDelta()` (barre chords gained or lost after transposition, clamped 1–5). Stubs have no chord data, so their guitarlele difficulty equals the guitar one.
- **Carlos's decision:** week order stays the same on both instruments; difficulty is displayed, not used to re-sort. A per-instrument order was proposed and declined.
- **Carlos's decision:** the player is untouched. Pitch-shifting the track (+5) was offered and rejected because the pitch slider already exists.

## Corrections and preferences

- Always verify in the browser before reporting done; the Chrome extension cannot open `file://`, so serve on 7432 first. If the extension is not connected, headless Chrome works, but its window has a 500px minimum width: test phone layouts inside a 375px same-origin iframe.
- After a deploy, a "nothing changed" report was a stale tab; Netlify serves `max-age=0, must-revalidate`, no service worker. Say "hard reload" before debugging.
- Marty Music is the preferred lesson source.
- Carlos wants a clear data format to fill in (chord bars, backing patterns) rather than prose instructions.

## Palace archetype: dashboard-app (since 2026-09-16 14:35)

- Adopted as `local-tool`; Carlos changed `.palace` and the registry to `dashboard-app` the same afternoon. The public Netlify deploy is the reason.
- **Documented deviation:** the tree is still flat (`index.html` at root, no `apps/`, no `docs/readme.html`, mockups at root). The restructure is the top of `BACKLOG.md`, not done yet, so `dashboard-app-layout` audits will flag it until then. The front door is `AGENTS.md` until the AG Insights readme template is supplied.

## Library (2026-10-14)

- **Carlos's decision:** concept C (Repertoire) from `mockups/library/` became the home screen, with A's search/grid as the library section. The mockups stay for reference.
- Defaults chosen without asking, open to change: tracks kept as Paths; progress in localStorage only (no sync); Learning capped at 2; run-through due after 14 days; goal 10; first run seeds Nothing Else Matters as playable, the stored track/week song as Learning and the next two built weeks as Up next.
- Song ids are `slug(title)` with accents folded (`crimenes-perfectos`); library search also folds accents. `year: null` means unknown (Copa rota): shown blank, sorted last.
- Rock en español (2026-10-14): 21 candidates at Carlos's request, tags `rock en español` and `calamaro`. **Carlos's preference:** he loves the B7 → Em pull (Flaca, Estadio Azteca, Copa rota); worth looking for in future picks.
- A practice day is `part` when any step is marked done or a song is logged as played, and `full` when one song has all 5 steps done. Past days are never recomputed.
- Only Every Rose and Knockin' have a full chord bar grid (`chords.sections`); the other 8 built songs have `chords.structure` only. A library that shows "what's built" has to distinguish these.

## Gotchas

- Web Audio: `source.stop()` fires `onended` just like a natural end. Any restart-while-playing (speed, pitch, markers, Pause) therefore reset the player and orphaned a looping source that Stop could not reach. `stopSrc()` now detaches the handler first and `playGen` guards the async `startSrc()`. Test the pitch-at-Original path as well as the SoundTouch one; the built songs default to +1, so the plain path is easy to miss. (2026-09-16, log: stop-buttons)

- `logs/` and every committed file are deployed by Netlify — the repo root is the publish directory.
- `songs.md` carries an uncommitted edit from before 2026-09-16; not mine to commit.
- `CLAUDE.md` is a symlink to `AGENTS.md`; edit `AGENTS.md`.
- GitHub repo is `moralec/Personal-Guitar` since 2026-10-11 (was `guitar-practice`; GitHub redirects). Netlify site `guitarp` still lists the old repo URL in its build settings but deploys from pushes regardless. `README.md` follows the estate template; keep it under ~150 lines.
