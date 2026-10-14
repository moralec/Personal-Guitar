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
| Play through the 68 auto-built songs and correct chords / timing by ear; then drop the song's auto chip | Built by the pipeline, nobody has checked them against the record (Matador and Enter Sandman BPM disagree with their charts) | L | low | `pipeline/out/`, `index.html` `BUILT` |
| Replace the placeholder strum on 8 hand-built songs with their UG patterns (`strum-from-ug.js --search`); Money for Nothing has none | 8 of 10 hand-built songs share one placeholder pattern | S | low | `index.html` `TRACKS` |
| Fix 5 dead UG chord links on hand-built songs (Knockin', Summer of '69, More Than Words, Tears in Heaven, Hotel California) | They 404 today; `--search` found working versions | S | low | `index.html` `TRACKS` links |
| Strumming grid for more than one bar / one pattern per section | UG patterns are often 2 bars or differ verse/chorus; the app keeps bar 1 of the first part | M | med | `index.html` `renderBtGrid`, `strum-from-ug.js` |
| Get the AG Insights `docs/readme.html` template from Carlos and write the DEVELOPER section | `dashboard-app-front-door` requires it and forbids creating it from scratch | M | low | `docs/readme.html` (new) |
| Restructure to the `dashboard-app` layout: `apps/index.html`, `docs/`, `reference/` for mockups, Netlify publish root → `apps/` | Archetype set to `dashboard-app` on 2026-09-16; `dashboard-app-layout` requires it and it also stops `logs/` and `MEMORY.md` deploying | M | med | `index.html`, `Practice.command`, `mockup-*.html`, Netlify site settings |
