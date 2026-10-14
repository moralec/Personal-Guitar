# Personal-Guitar: a single-page guitar practice programme for one player

> **Area:** Personal · **Runs on:** Netlify (static site); edited on mac-mini-m4-2025 · **Status:** active

## What it does

A practice app for Carlos, built around songs he can play end to end. It opens on a library: today's
session, a practice streak, a repertoire board (Up next, Learning, Can play end to end) and all 57
songs from `songs.md`, with the three 10-week tracks (Beginner, Intermediate, Advanced) as paths.
Every built song walks through five steps: a warmup video, a full song lesson with tab and chord
links, a strumming pattern on a 16-step grid with a metronome, chord diagrams, and a play-along player
with A-B looping, speed and pitch shift. A header toggle switches between guitar and guitarlele and
transposes the chords a 4th down. Weeks not yet built show "Coming soon".

## How to use it

Nothing to install. Day to day:

- Live: https://guitar.ag-insights.co.uk
- Local, no server: open `index.html` directly (`file://` works)
- Local server on port 7432 (needed for `strumming.html`'s microphone): double-click `Practice.command`,
  or `python3 -m http.server 7432` and open http://localhost:7432/index.html

To turn an Ultimate Guitar chord chart into a week's `bars` arrays:

    node parse-chords.js song.txt [keymap.json]

How to add or build a week (the session object shape, chord-shape rules) is in [`AGENTS.md`](AGENTS.md).

## Where it runs

- **Live:** Netlify site `guitarp`, custom domain `guitar.ag-insights.co.uk`. Every push to `main`
  deploys. There's no build step, and the repo root is the publish directory.
- **Local:** nothing resident. `Practice.command` starts a foreground `python3 -m http.server` on
  7432 and stops when its terminal window closes. There are no launchd or cron jobs.

## How it's built

| File | Role |
|---|---|
| `index.html` | The whole app: HTML, CSS and JS in one file, no build step. Session data is the `TRACKS` literal, and chord diagrams are SVG generated from `CHORD_SHAPES` |
| `strumming.html` | Standalone microphone-driven strumming trainer; needs localhost or https for mic access |
| `parse-chords.js` | Node CLI: UG "chords over lyrics" text + optional keymap → `bars` JSON |
| `songs.md` | Candidate songs with Chords / Licks / Timing ratings; feeds track and week placement and the header Difficulty |
| `Practice.command` | Double-click launcher: local server on 7432 + opens the app |
| `mockup-a/b/c.html` | Original layout mockups, unused and untracked |

Dependencies and outside services:

- **SoundTouchJS**, loaded from jsDelivr for pitch shift. If it fails to load, playback is unshifted.
- **YouTube embeds** for the warmup and lesson videos.
- **Ultimate Guitar** and similar sites are linked for tabs and chords. Nothing is fetched from them.
- **Web Audio API** runs the metronome, the backing kick/snare pattern and the play-along player.

## Data and secrets

- Song data (chords, backing patterns, video IDs, links) lives in `index.html`. Candidates live in `songs.md`.
- The browser keeps your progress in `localStorage`: `guitarProgress` (repertoire board, steps done,
  practice days, goal), `guitarSong` (last song opened) and `guitarInstrument`. It does not sync between
  devices. `guitarTrack` / `guitarWeekV2` are only read once, to seed the board on first run.
- Play-along audio is a file you choose in the browser each session. It is never uploaded or stored,
  and no audio is committed to the repo.
- There are no keys, tokens or accounts.
- Everything committed is public: the repo is public and Netlify serves the whole root, `logs/` and
  `MEMORY.md` included. Excluding those from the publish is on the backlog.

## Related

- Memory Palace member (`.palace`): open a session with `memory brief`.
- [`AGENTS.md`](AGENTS.md) (also `CLAUDE.md`): the front door for agents, including the session format.
- [`MEMORY.md`](MEMORY.md): decisions, corrections and gotchas.
- [`BACKLOG.md`](BACKLOG.md): pending work.
- [`logs/`](logs/INDEX.md): session history.
- `INBOX.md`: messages from other estate projects. It stays local and is not committed.
