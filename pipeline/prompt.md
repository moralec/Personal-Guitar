You are building one song's practice session for a guitar practice app. Research the song on the web and write ONE JSON file. Nothing else.

SONG: {{TITLE}} — {{ARTIST}} ({{YEAR}}), key per our records: {{KEY}}
CHART TO USE: {{CHART_URL}}   (when this is a URL: an Ultimate Guitar chords page whose strumming pattern is already extracted, so use this same chart for the chords)
TEMPO HINT: {{BPM_HINT}} BPM (from that chart's strumming data; confirm against the recording)
OUTPUT FILE: {{OUT}}   (write it with your file-writing tool; do not create any other file)

The player is a ~15-year casual guitarist (intermediate). He learns by watching one full-song lesson video, practising the strumming pattern, then playing along to the record section by section.

Find and return:

1. **chart_url**: the chart above (or a better chords page if that one is unreadable; say why in notes). **tab_url**: a tab for the riffs/solos if one exists, else null.
2. **key** as the chart's chord shapes imply (e.g. "E minor"), and **capo**: the capo fret the chart uses (0 if none). If the chart is written a semitone low in flats (e.g. Gb/Badd9 instead of G/Cadd9) because the band tuned down, write the chords in the natural key the shapes imply and set "tuned_down_semitone": true; otherwise false.
3. **bpm** of the original recording (check songbpm.com or similar) with **bpm_source** URL. If the recording reads as half/double time, use the value that matches the strumming feel and say so in notes.
4. **chords**: the whole song as bars of 4 beats, in this exact shape:
   "sections": { "<key>": { "label": "Verse", "bars": [["G","G","C","C"], ...] }, ... }
   "sequence": [ { "key": "<section key>", "label": "Verse 1" }, ... ]   // the song in order, repeats allowed
   - One bar = 4 beats; a chord held 2 beats appears twice. Use the chart's chord changes; where the bar length is ambiguous, make a musically sensible choice and say so in "notes".
   - Chord names in plain form, as the chart's shapes: G, Em, B7, Cadd9, D/F#, F#m, Bm7. No "N.C.", no "x2", no lyrics.
   - Keep the sequence in the order of the recording (intro first, outro last).
   - Do NOT copy any lyrics anywhere in the file.
5. **lesson**: ONE YouTube full-song guitar lesson for this exact song. Prefer Marty Music; for Spanish-language songs a well-viewed Spanish tutorial is fine. Give "videoId" (the 11-character id), "channel", "title", "url". It must teach the song, not be the music video or a cover.
6. **warmup**: ONE YouTube video for a 5-minute warmup of the hardest technique in THIS song. Decide first what that is — e.g. a specific chord change (like G→B7, or a barre chord like F#m), barre chords in general, palm muting, fingerpicking/arpeggios, a pentatonic riff, 16th-note strumming. Only use a generic strumming workout if strumming really is the hardest part. Give "videoId", "channel", "title", "url", "focus" (short title, e.g. "B7 chord changes") and "why" (one sentence linking it to this song).
7. **notes**: anything uncertain or guessed. Be honest; a guessed value marked as guessed is fine, an invented one is not.

Rules:
- Every URL and videoId must come from a page you actually opened in this session. Never invent an id. If you cannot find something, use null and explain in notes.
- To find YouTube ids, you may fetch https://www.youtube.com/results?search_query=... and read the ids from the page.
- Write valid JSON only (no comments, no trailing commas) with exactly these top-level keys:
  title, artist, chart_url, tab_url, key, capo, tuned_down_semitone, bpm, bpm_source, chords, lesson, warmup, notes
