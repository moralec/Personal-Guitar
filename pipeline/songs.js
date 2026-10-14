#!/usr/bin/env node
// songs.js — print every song that has no built session yet, as TSV: slug, title, artist, year, key, where
// (where = "beginner:3" for a stub week, "candidate" for a library-only song). Read from index.html.
const fs = require('fs'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const grab = (start, end) => { const a = s.indexOf(start); return s.slice(a, s.indexOf(end, a) + end.length); };
const ctx = {};
new Function('ctx', [grab('const STUB', ';'), grab('const TRACKS', '\n};'), grab('const CANDIDATES', '\n];'),
  'ctx.TRACKS = TRACKS; ctx.CANDIDATES = CANDIDATES;'].join('\n'))(ctx);
const slug = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = [];
for (const [track, t] of Object.entries(ctx.TRACKS))
  for (const [w, x] of Object.entries(t.sessions)) if (x.coming) rows.push([slug(x.title), x.title, x.artist, x.year, x.key, `${track}:${w}`]);
for (const x of ctx.CANDIDATES) rows.push([slug(x.title), x.title, x.artist, x.year || '?', x.key, 'candidate']);
console.log(rows.map(r => r.join('\t')).join('\n'));
