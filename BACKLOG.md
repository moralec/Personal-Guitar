# BACKLOG.md — guitar

Pending work, lowest risk first. Removed when done.

| What | Why | Effort | Risk | Files |
|---|---|---|---|---|
| Commit or discard the pending `songs.md` edit | It predates the Palace log and is invisible to the next session otherwise | S | low | `songs.md` |
| Decide whether `mockup-*.html` and `mockups/library/` are tracked or deleted | Untracked; the library concepts were used for the 2026-10-14 build | S | low | `mockup-a/b/c.html`, `mockups/library/` |
| Exclude `logs/`, `MEMORY.md`, `BACKLOG.md` from the Netlify publish | They are deployed to the public site today; harmless but pointless | S | low | `netlify.toml` (new) |
| Warn in console when a chord in `bars` has no `CHORD_SHAPES` entry (or no guitarlele counterpart) | Missing diagrams are silent today | S | low | `index.html` `renderChordSection` |
| Session page is ~30px wider than a 375px phone (the 16-step strumming grid); predates the library | Sideways scroll on a phone | S | low | `index.html` `.bt-grid` CSS |
| Decide whether progress should sync between devices (today `guitarProgress` is per browser) | The live site on a phone won't see the Mac's streak or board | M | med | `index.html` `Progress` |
| Build the remaining stub weeks (Beginner 6 stubs, Intermediate 4, Advanced 9) | The programme is the point of the app | L | med | `index.html` `TRACKS`, `parse-chords.js`, `songs.md` |
| Get the AG Insights `docs/readme.html` template from Carlos and write the DEVELOPER section | `dashboard-app-front-door` requires it and forbids creating it from scratch | M | low | `docs/readme.html` (new) |
| Restructure to the `dashboard-app` layout: `apps/index.html`, `docs/`, `reference/` for mockups, Netlify publish root → `apps/` | Archetype set to `dashboard-app` on 2026-09-16; `dashboard-app-layout` requires it and it also stops `logs/` and `MEMORY.md` deploying | M | med | `index.html`, `Practice.command`, `mockup-*.html`, Netlify site settings |
