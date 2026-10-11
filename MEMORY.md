# MEMORY.md — guitar

Decisions that constrain new code, corrections received, gotchas. Rewritten as state changes; history is in `logs/`.

## Architecture

- One file, `index.html`. All state is module-level `let`s; persistence is three localStorage keys: `guitarTrack`, `guitarWeekV2`, `guitarInstrument`.
- Session data is the `TRACKS` literal. Rendering is `renderSession()` → `renderChordSection()`, `renderBtGrid()`, `resetPlayer()`. Coming-soon weeks hide `#stepsSection` but leave the previous DOM inside it.
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

- Always verify in the browser before reporting done; the Chrome extension cannot open `file://`, so serve on 7432 first.
- After a deploy, a "nothing changed" report was a stale tab; Netlify serves `max-age=0, must-revalidate`, no service worker. Say "hard reload" before debugging.
- Marty Music is the preferred lesson source.
- Carlos wants a clear data format to fill in (chord bars, backing patterns) rather than prose instructions.

## Palace archetype: dashboard-app (since 2026-09-16 14:35)

- Adopted as `local-tool`; Carlos changed `.palace` and the registry to `dashboard-app` the same afternoon. The public Netlify deploy is the reason.
- **Documented deviation:** the tree is still flat (`index.html` at root, no `apps/`, no `docs/readme.html`, mockups at root). The restructure is the top of `BACKLOG.md`, not done yet, so `dashboard-app-layout` audits will flag it until then. The front door is `AGENTS.md` until the AG Insights readme template is supplied.

## Gotchas

- Web Audio: `source.stop()` fires `onended` just like a natural end. Any restart-while-playing (speed, pitch, markers, Pause) therefore reset the player and orphaned a looping source that Stop could not reach. `stopSrc()` now detaches the handler first and `playGen` guards the async `startSrc()`. Test the pitch-at-Original path as well as the SoundTouch one; the built songs default to +1, so the plain path is easy to miss. (2026-09-16, log: stop-buttons)

- `logs/` and every committed file are deployed by Netlify — the repo root is the publish directory.
- `songs.md` carries an uncommitted edit from before 2026-09-16; not mine to commit.
- `CLAUDE.md` is a symlink to `AGENTS.md`; edit `AGENTS.md`.
- GitHub repo is `moralec/Personal-Guitar` since 2026-10-11 (was `guitar-practice`; GitHub redirects). Netlify site `guitarp` still lists the old repo URL in its build settings but deploys from pushes regardless. `README.md` follows the estate template; keep it under ~150 lines.
