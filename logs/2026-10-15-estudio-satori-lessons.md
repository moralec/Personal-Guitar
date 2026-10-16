# 2026-10-15 — Estudio Satori as the lesson source for rock en español

**Asked:** for rock en español (Calamaro) tutorials, prioritise https://www.youtube.com/estudiosatori.

**Found** (channel search per song and per artist, 2026-10-15): guitar tutorials for 6 of the 22 rock en español songs.

| Song | Lesson now | Was |
|---|---|---|
| Sin documentos | iX7Ce6UZWcc | guitarraviva 4NPtHomj4Hw |
| Mil horas | Rjaes8wQAh4 | D.A.M 9skDHa94kX0 |
| Eres | DMFtiI37shs | christianvib Pu5A-jA4sl8 |
| En la ciudad de la furia | 6NRzYfHlWBY | D.A.M 125Kqw6UDKo |
| Mariposa tecknicolor | mfomemgURwo | D.A.M 7emHCM9DBKE |
| Tuyo siempre | XWtfkd1_Ino | (pipeline had already picked it; song was built but never assembled) |

Ukulele-only on her channel, left on their guitar lessons: Flaca 6MvKosRdTKs, Te quiero igual N7JcbNBKQ5w, De música ligera CdCqVbodUEQ, Lamento boliviano shOOOQPQeUg, Persiana americana kSix5SvUo0E. Nothing found for the other 11.
Calamaro songs she teaches on guitar that are not in the library: Mi enfermedad (jvb0KAdrh0M), Cuando no estás (JBs6JC0J7FU), La parte de adelante (npf4rF_FmM0).

**Did:** edited `lesson` in `pipeline/out/<slug>.json` for the five, re-ran check.js (no FAIL; WARN on channel name, see MEMORY.md), `node pipeline/assemble.js` → BUILT 69 (adds Tuyo siempre). `pipeline/prompt.md` lesson rule now prefers Estudio Satori guitar tutorials for Spanish-language songs. Verified with headless Chrome (Chrome extension not connected): Tuyo siempre and Mil horas render with the Satori lesson.

**Not checked:** whether her tutorials play in the same key as the UG charts behind the chord diagrams — the video descriptions give no key or capo.

## New songs from her channel

Full channel list (143 videos, 69 guitar tutorials) pulled via YouTube's browse API. Carlos picked 9; added to `songs.md` and `CANDIDATES` with years from es.wikipedia and keys from the most-voted UG chords version (details in songs.md Notes): Té para tres, Vasos vacíos, Rezo por vos, Mi enfermedad (credited to Los Rodríguez, first release *Buena suerte* 1991), Corazón espinado, Rasguña las piedras, Inconsciente colectivo, Afuera, Rayando el sol. Then El cantante and El salmón (Calamaro) at his request — Satori has neither.

Pipeline (3 herdr workers): 8 passed with Satori lessons and were assembled (BUILT 77). Vasos vacíos, El cantante, El salmón still building at deploy time; they show as "Coming soon" until assembled.

**Found, not fixed:** `strum-from-ug.js --search` folds the artist without decoding HTML entities, so "Charly García" never matched UG's "Charly Garc&iacute;a" for Inconsciente colectivo ("no public chords versions"). Both of its Charly García charts checked by URL have no pattern, so nothing lost here — but other accented artists may have missed patterns the same way.

## 2026-10-16 — last three built and deployed

Vasos vacíos (Satori lesson), El cantante and El salmón passed and were assembled (BUILT 80). El salmón's lesson is Clases de Guitarra Facundo. El cantante has no Calamaro-specific tutorial with real views (best found: 94 views), so it keeps Mauro Martinez's 491K-view tutorial, which teaches Héctor Lavoe's recording — same song, key not checked against Calamaro's. Added `Adim7` (x01212) and its guitarlele counterpart `Edim7` (0x2323) to `CHORD_SHAPES`; El cantante's check had warned the diagram was missing.

## 2026-10-16 — library filters instead of path cards; starred songs

Carlos: the Paths cards sat awkwardly and were really just filters; also drop the status chips (all 90 songs are Ready) and add favourites. Done:
- Removed the path/loop cards and the By difficulty / By chord loop switch (from the chord-loops session, 199ae55). Path and Loop are now chip rows with counts, combinable with each other, level, tags and search; Loop shows 8 then "All N loops". `loopWhere` and the card CSS deleted; `loopName` kept (loop page uses it).
- Removed the All / Ready / Queued / Candidate chips; cards keep their status badge.
- `Progress.data.starred[id] = time`; ☆/★ on each song card (bottom-left of the thumbnail) and at the start of the song page's repertoire row; "★ Starred n" chip filters. Per browser, like the rest of guitarProgress.
Verified by driving headless Chrome over CDP: star two songs → chip shows 2, filter lists exactly those, stars survive reload, unstar on the song page works, no exceptions; at 390px no element is wider than the viewport.
