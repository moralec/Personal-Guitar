# Guitar Practice App

Single-file HTML guitar practice tool for one user (Carlos). Open `index.html` directly (`file://` works) or run `Practice.command` for a local server on port 7432. Live at https://guitar.ag-insights.co.uk — every push to `main` deploys via Netlify.

Member of the Memory Palace: `.palace` declares `local-tool` / `personal`. Open a session with `memory brief`; law lives in the Palace's `CANON.md`, not here. Decisions and gotchas are in `MEMORY.md`, pending work in `BACKLOG.md`, session history in `logs/`.

## Library (home screen)

The app opens on the library (`#/`): a **Today** card resuming the learning song furthest into today's session, a practice streak with 14-day calendar and repertoire goal, a **Repertoire** board (Up next → Learning, max 2 → Can play end to end, with a "due a run-through" nudge after 14 days), and the full song **Library**: search, status / level / style filters, and the three tracks as **Paths**. Every song in `TRACKS` and `CANDIDATES` is in it. A song opens at `#/song/<slug-of-title>`.

Progress lives in one localStorage key, `guitarProgress`, behind the `Progress` object in `index.html`: board state per song, steps marked done today, last run-through, practice days, goal. It is per browser and does not sync between devices.

## Session structure

Three tracks (Beginner, Intermediate, Advanced) × 10 weeks, plus `CANDIDATES` (in the library but not in a track; they open as "Coming soon"). Each built week has 5 steps, each with a **Mark done** toggle that feeds the streak:

1. **Warmup** — YouTube thumbnail, click-to-embed
2. **Full Song Lesson** — YouTube embed + tab/chord links (Marty Music preferred)
3. **Strumming Pattern** — Beat/Strum 16-step grid, Web Audio metronome
4. **Chords** — SVG diagrams from `CHORD_SHAPES`, one per unique chord
5. **Play Along** — Web Audio A-B loop player (speed + pitch shift) → song map below

Header toggle **Guitar / Guitarlele** transposes steps 4 and 5 a 4th down (see `MEMORY.md`). The header shows BPM, Difficulty (songs.md score, Chords adjusted for the instrument) and one key chip: `Key` on guitar, `Shapes` on guitarlele.

## Adding or building a week

Edit the session object under `TRACKS.<track>.sessions[<week>]` in `index.html`. A stub has `coming: true`; a built week has (every session also carries `tags: [...]` from songs.md, used by the library filters):

```javascript
1: {
  title: "Song", rating: { chords: 1, licks: 2, timing: 1 },   // from songs.md, 1–5 each
  artist: "Artist", year: 1988, bpm: 88, key: "G major", defaultPitch: 0,
  backing: { kick: [16 × 0|1], snare: [16 × 0..1] },   // fractional snare = ghost note opacity
  warmup: { videoId, label, title, meta },
  lesson: { videoId, label },
  links:  [{ label: "🎸 Tab", url }, { label: "🎵 Chords", url }],
  chords: {
    sections: { intro: { label: "Intro", bars: [["G","G","G","G"], ...] }, ... },
    sequence: [{ key: "intro", label: "Intro" }, { key: "verse", label: "Verse 1" }, ...]
  }
}
```

- Every chord name in `bars` needs an entry in `CHORD_SHAPES`, **and** its counterpart a 4th down (Cadd9 → Gadd9), or the guitarlele diagram is silently missing.
- `parse-chords.js` turns an Ultimate Guitar chord chart + keymap JSON into the `bars` arrays: `node parse-chords.js song.txt keymap.json`.
- `songs.md` is the candidate list with difficulty ratings that feeds track/week placement. Pool songs not in a track are the `CANDIDATES` array; moving one into `TRACKS` schedules it. Don't rename a song's title once it's in use: its slug is the key for its progress.

## Files

| File | Role |
|---|---|
| `index.html` | The whole app: HTML + CSS + JS, no build step, no CDN except SoundTouchJS for pitch shift (falls back to plain playback) |
| `parse-chords.js` | CLI: UG chord chart → session `bars` JSON |
| `songs.md` | Candidate songs with Chords/Licks/Timing ratings |
| `strumming.html` | Standalone mic-driven strumming trainer; needs localhost for mic access |
| `Practice.command` | Double-click: local server on 7432 + opens the app |
| `mockup-a/b/c.html` | Original layout mockups, unused |
