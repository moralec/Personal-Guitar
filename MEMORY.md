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
- **Spanish-language songs: Estudio Satori first** (Eliana De Piero, youtube.com/estudiosatori; Carlos, 2026-10-15) — but only her *guitar* tutorials; many of her videos are ukulele. Search `youtube.com/@estudiosatori/search?query=...`. `pipeline/prompt.md` says the same. YouTube oEmbed reports her older videos as "Eliana De Piero", so check.js WARNs on the channel name; harmless.
- Carlos wants a clear data format to fill in (chord bars, backing patterns) rather than prose instructions.

## Palace archetype: dashboard-app (since 2026-09-16 14:35)

- Adopted as `local-tool`; Carlos changed `.palace` and the registry to `dashboard-app` the same afternoon. The public Netlify deploy is the reason.
- **Documented deviation:** the tree is still flat (`index.html` at root, no `apps/`, no `docs/readme.html`, mockups at root). The restructure is the top of `BACKLOG.md`, not done yet, so `dashboard-app-layout` audits will flag it until then. The front door is `AGENTS.md` until the AG Insights readme template is supplied.

## Library (2026-10-14)

- **Carlos's decision:** concept C (Repertoire) from `mockups/library/` became the home screen, with A's search/grid as the library section. The mockups stay for reference.
- Defaults chosen without asking, open to change: tracks kept as Paths; progress in localStorage only (no sync); Learning capped at 2; run-through due after 14 days; goal 10; first run seeds Nothing Else Matters as playable, the stored track/week song as Learning and the next two built weeks as Up next.
- Song ids are `slug(title)` with accents folded (`crimenes-perfectos`); library search also folds accents. `year: null` means unknown (Copa rota): shown blank, sorted last.
- **Carlos's decision (2026-10-16): the library filters are rows of chips, not cards.** Paths were "just filters" drawn as destinations; Path and Loop are chip rows that combine with level, tags and search. Status chips (All/Ready/Queued/Candidate) removed — every song is Ready. Favourites: `guitarProgress.starred`, ☆ on cards and the song page, "★ Starred" filter.
- Rock en español (2026-10-14): 21 candidates at Carlos's request, tags `rock en español` and `calamaro`. **Carlos's preference:** he loves the B7 → Em pull (Flaca, Estadio Azteca, Copa rota); worth looking for in future picks. The V7 → i pull in other keys counts too: Afuera (F#7 → Bm), El cantante (D → Gm). 2026-10-15/16: 11 more added (9 from Estudio Satori's channel + El cantante, El salmón); library now 90 songs, 80 built.
- A practice day is `part` when any step is marked done or a song is logged as played, and `full` when one song has all 5 steps done. Past days are never recomputed.
- Only Every Rose and Knockin' have a full chord bar grid (`chords.sections`); the other 8 built songs have `chords.structure` only. A library that shows "what's built" has to distinguish these.

## Chord loops (2026-10-15)

- **Carlos's decision:** loops come in through the library (Paths → By chord loop, `#/loop/<id>`), not through the song page. *(Superseded 2026-10-16: the Paths cards and the By chord loop switch are gone; loops are a Loop filter row — see Library filters below. Loop pages unchanged.)* The song page shows which loop it is and nothing else; a "same loop in other songs" panel was mocked and dropped because he doesn't want to move song to song from song pages.
- Loops are computed, not stored: `chartSections()` handles `sections`, `grid` and `structure` charts. Rotations count as one loop, written from the home chord; a section only counts when it is one cycle of 2–4 degree changes. Families (`getLoopFamilies()`) are loops in ≥2 songs, sorted by song count; the library shows the top 8 and an "All N loops" card.
- Degrees are relative to the tonic of the session's `key`; upper/lower case comes from each chord, not from the key's major/minor. So only a wrong tonic breaks a loop. Checked 2026-10-15: every chart contains its key's tonic chord. Three are labelled minor over major chords (Brain Stew, Back in Black, Sunshine of Your Love: blues-rock riffs); their loops are still right.
- The loop player adds the song's `capo` so it sounds in the record's key (Free Fallin' plays F, shown as D shapes). Family song order is re-sorted on instrument change because difficulty is per instrument.
- Loop player plays the guitar chord names (the record's key) via `CHORD_SHAPES` voicings, falling back to a triad; on guitarlele only the shown names change.
- **Carlos's decision:** Beginner path reordered so each week adds one chord or loop: Every Rose, Free Fallin', Good Riddance, Knockin', Here I Go Again, With or Without You, Wonderwall, Smoke on the Water, Summer of '69, Wish You Were Here. Progress is keyed by slug, so nothing was lost; `whereLabel` and the Today card follow the new weeks.

## Pipeline (2026-10-14)

- **Carlos's decision:** a song with no UG strumming pattern is still built; only the strumming step is hidden (`backing: null`, `stepsFor()`). A full practice day then means all 4 of its steps.
- UG chords pages embed `tab_view.strummings` in the `js-store` JSON. Step codes from UG's bundle: 1/2/3 down (plain/muted/accent), 101/102/103 up, 201 palm mute, 202 pause, 203 rest. Patterns belong to individual versions; most versions have none, so `--search` walks the most-voted versions. Triplet patterns don't fit the 16-step grid and count as none.
- DeepSeek (opencode-go) is good at finding real lesson videos (oEmbed-verified) and chord charts, honest in `notes`, weak at inventing strum patterns (it missed muted strums on Flaca) — that is why strumming comes from the script. One agent drifted into other songs' output files and wrote nothing; outputs were verified title-for-title afterwards. Give each agent its own folder next time.
- Pay-per-use `opencode/` provider cost ~$0.11–0.13 per song in the test; Carlos's runs go on `opencode-go/`.
- Key in a BUILT entry is the chart's shape key, with `capo` shown as a chip; `defaultPitch: 1` for songs the chart marks as tuned down a semitone (GN'R etc.).
- **Hand-fixing an auto-built song:** edit `pipeline/out/<slug>.json`, re-run `node pipeline/check.js pipeline/out/<slug>.json index.html pipeline/strum/<slug>.json > pipeline/out/<slug>.check.txt`, then `node pipeline/assemble.js` (only that song's BUILT line should change in the diff). Editing the BUILT line directly is undone by the next assemble. (2026-10-16, Tuyo siempre)
- **The chart's key can differ from the lesson's.** Tuyo siempre was charted in E minor from UG, but the Satori lesson (and LaCuerda's second version) play it in A minor; Carlos spotted it from the video's chord boxes. A different key is not just a transposition: the A-minor chart also had E→E7 and a B7–F–E pre-chorus the Em chart had garbled. When a lesson is set, check its chords against the chart. LaCuerda pages put the chart in a `<pre>`, readable with curl. (2026-10-16)

## Gotchas

- Web Audio: `source.stop()` fires `onended` just like a natural end. Any restart-while-playing (speed, pitch, markers, Pause) therefore reset the player and orphaned a looping source that Stop could not reach. `stopSrc()` now detaches the handler first and `playGen` guards the async `startSrc()`. Test the pitch-at-Original path as well as the SoundTouch one; the built songs default to +1, so the plain path is easy to miss. (2026-09-16, log: stop-buttons)

- `logs/` and every committed file are deployed by Netlify — the repo root is the publish directory.
- `songs.md` carries an uncommitted edit from before 2026-09-16; not mine to commit.
- `CLAUDE.md` is a symlink to `AGENTS.md`; edit `AGENTS.md`.
- GitHub repo is `moralec/Personal-Guitar` since 2026-10-11 (was `guitar-practice`; GitHub redirects). Netlify site `guitarp` still lists the old repo URL in its build settings but deploys from pushes regardless. `README.md` follows the estate template; keep it under ~150 lines.
