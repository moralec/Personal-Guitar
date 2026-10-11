# 2026-10-11 — Repo tidy-up: rename to Personal-Guitar, standard README

Triggered by the `admin` INBOX message of 2026-10-11 (operator's decision: push, rename to the portal area, standard README).

- **Push:** `main` was level with `origin/main` (0 ahead / 0 behind). Nothing to push. Uncommitted `songs.md` and untracked `mockup-*.html` / `INBOX.md` left as they were: not covered by the message.
- **Rename:** `moralec/guitar-practice` → `moralec/Personal-Guitar`. The auto-mode classifier refused `gh repo rename`; Carlos ran it himself. `origin` repointed, `git fetch` OK. Local folder unchanged.
- **README:** new `README.md` in the estate template, facts checked against `index.html`, `strumming.html`, `parse-chords.js`, `Practice.command` and the Netlify API. Commit `bfedf82`.
- **Netlify:** site `guitarp` built and published `bfedf82` (state `ready`) after the rename, so the GitHub link survives. Its `build_settings.repo_url` still reads the old URL; left unchanged, it is cosmetic.
- **Memory Palace:** unreachable (ssh to macbook-pro-2015 timed out); no brief this session.
- **Not done:** the 2026-09-16 `memoryPalace` INBOX message is still `new`. It was outside this session's ask.
