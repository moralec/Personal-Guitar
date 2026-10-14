#!/usr/bin/env node
/**
 * strum-from-ug.js
 * Reads the strumming patterns an Ultimate Guitar chords page carries in its page data
 * and turns them into the app's backing format.
 *
 * Usage:
 *   node strum-from-ug.js <ultimate-guitar chords URL | saved .html file> [part] [bar]
 *   node strum-from-ug.js --search "<title>" "<artist>" [part] [bar]
 *
 *   add --json anywhere to print one JSON object instead of text (for the build pipeline)
 *
 *   --search looks the song up on UG and opens its chords versions, most-voted first, until one
 *   carries a strumming pattern (patterns belong to individual versions; most have none).
 *
 *   part  which pattern to convert (name like "Verse", or 1-based index; default: the first)
 *   bar   which bar of that pattern (1-based; default 1). The app's grid holds one bar.
 *
 * Output: every pattern found, as text, plus a `backing:` line ready to paste into a session.
 *
 * The step codes come from UG's own web app (the table that renders the arrows):
 *   1 down · 2 muted down · 3 accented down · 101 up · 102 muted up · 103 accented up
 *   201 palm mute · 202 "pause" (hand moves, no strum) · 203 real rest
 */

const fs = require('fs');

const CODES = {
  1:   { s: 'D',  v: 0.7 }, 2:   { s: 'd',  v: 0.4 }, 3:   { s: 'D>', v: 1 },
  101: { s: 'U',  v: 0.7 }, 102: { s: 'u',  v: 0.4 }, 103: { s: 'U>', v: 1 },
  201: { s: 'PM', v: 0.4 }, 202: { s: '·',  v: 0 },   203: { s: '-',  v: 0 },
};

async function loadHtml(src) {
  if (!/^https?:/.test(src)) return fs.readFileSync(src, 'utf8');
  const r = await fetch(src, { headers: UA });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${src}`);
  return r.text();
}

// UG embeds its page state as HTML-escaped JSON in <div class="js-store" data-content="...">
function pageData(html) {
  const m = html.match(/class="js-store" data-content="([^"]*)"/);
  if (!m) throw new Error('no js-store data on this page (not a UG tab page?)');
  const txt = m[1].replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return JSON.parse(txt).store.page.data;
}

// Names inside the data are still HTML-escaped ("Andr&eacute;s")
const NAMED = { aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú', ntilde: 'ñ', uuml: 'ü', Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ', ouml: 'ö', auml: 'ä', amp: '&', quot: '"', apos: "'" };
const unescape = t => String(t).replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&([a-zA-Z]+);/g, (m, n) => NAMED[n] || m);

// One pattern → bars in its own subdivision (for reading) and as 16 sixteenth-note steps (for the app)
function nativeBars(p) {
  const codes = p.measures.map(m => m.measure), out = [];
  for (let i = 0; i < codes.length; i += p.denuminator) out.push(codes.slice(i, i + p.denuminator));
  return out;
}
function toBars(p) {
  if (p.is_triplet) throw new Error(`"${p.part}" is a triplet pattern; the app's 16-step grid cannot hold it`);
  const per = { 4: 4, 8: 8, 16: 16 }[p.denuminator];   // sic: UG spells it "denuminator"
  if (!per) throw new Error(`"${p.part}": unsupported subdivision 1/${p.denuminator}`);
  const codes = p.measures.map(m => m.measure);
  const bars = [];
  for (let i = 0; i < codes.length; i += per) {
    const steps = Array(16).fill(203);
    codes.slice(i, i + per).forEach((c, k) => { steps[k * (16 / per)] = c; });
    bars.push(steps);
  }
  return bars;
}

// Text with a bar line after every beat
const UA = { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' };
const fold = t => unescape(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Chords versions of title + artist on UG, most-voted first
async function searchVersions(title, artist) {
  const r = await fetch(`https://www.ultimate-guitar.com/search.php?search_type=title&value=${encodeURIComponent(title)}`, { headers: UA });
  if (!r.ok) throw new Error(`search HTTP ${r.status}`);
  const res = pageData(await r.text()).results || [];
  const t = fold(title), a = fold(artist);
  return res.filter(x => x.type === 'Chords' && x.tab_access_type === 'public' && fold(x.song_name).includes(t) && fold(x.artist_name).includes(a))
            .sort((x, y) => (y.votes || 0) - (x.votes || 0));
}

const text = (steps, perBeat) => steps.map((c, i) => (CODES[c] || { s: '?' }).s.padEnd(2) + ((i + 1) % perBeat === 0 && i < steps.length - 1 ? ' |' : '')).join(' ');

(async () => {
  const JSON_OUT = process.argv.includes('--json');
  const argv = process.argv.slice(2).filter(a => a !== '--json');
  if (JSON_OUT) { const log = console.log; console.log = () => {}; global.__emit = o => log(JSON.stringify(o)); }
  const emit = o => { if (JSON_OUT) global.__emit(o); };
  let src, partArg, barArg, data;
  if (argv[0] === '--search') {
    const [, title, artist] = argv; [partArg, barArg] = argv.slice(3);
    if (!title || !artist) { console.error('Usage: node strum-from-ug.js --search "<title>" "<artist>" [part] [bar]'); process.exit(1); }
    const versions = await searchVersions(title, artist);
    if (!versions.length) { console.log(`No public chords versions on UG for "${title}" by ${artist}.`); emit({ found: false, reason: 'no public chords versions' }); process.exit(2); }
    for (const v of versions.slice(0, 8)) {          // polite: at most 8 pages, 1.5 s apart
      const d = pageData(await loadHtml(v.tab_url));
      const n = ((d.tab_view || {}).strummings || []).length;
      console.log(`  v${v.version} · ${v.votes} votes · ${n ? n + ' pattern(s)' : 'no pattern'} · ${v.tab_url}`);
      if (n) { data = d; src = v.tab_url; break; }
      await sleep(1500);
    }
    if (!data) { console.log(`None of the top ${Math.min(8, versions.length)} chords versions has a strumming pattern.`); emit({ found: false, reason: `none of ${Math.min(8, versions.length)} versions has a pattern`, tried: versions.slice(0, 8).map(v => v.tab_url) }); process.exit(2); }
    console.log('');
  } else {
    [src, partArg, barArg] = argv;
    if (!src) { console.error('Usage: node strum-from-ug.js <UG chords URL | page.html> [part] [bar]'); process.exit(1); }
    data = pageData(await loadHtml(src));
  }
  const tv = data.tab_view || {};
  const tab = data.tab || {};
  const patterns = tv.strummings || [];
  console.log(`${unescape(tab.song_name || '?')} — ${unescape(tab.artist_name || '?')} · ${tab.type || ''} v${tab.version || '?'} · rating ${tab.rating ? tab.rating.toFixed(2) : '?'} (${tab.votes || 0} votes)`);
  if (!patterns.length) { console.log('No strumming pattern on this page. Try another version of the chords.'); emit({ found: false, reason: 'no pattern on this page', url: src }); process.exit(2); }

  const unknown = [...new Set(patterns.flatMap(p => p.measures.map(m => m.measure)).filter(c => !CODES[c]))];
  if (unknown.length) console.log(`WARNING unknown step codes: ${unknown.join(', ')}`);

  patterns.forEach((p, i) => {
    console.log(`\n[${i + 1}] ${p.part} · ${p.bpm} BPM · 1/${p.denuminator}${p.is_triplet ? ' · TRIPLET' : ''} · ${p.measures.length} steps`);
    try { toBars(p); nativeBars(p).forEach((b, k) => console.log(`    bar ${k + 1}: ${text(b, p.denuminator / 4)}`)); }
    catch (e) { console.log('    ' + e.message); }
  });

  const pick = partArg ? (patterns.find(p => p.part.toLowerCase() === String(partArg).toLowerCase()) || patterns[+partArg - 1]) : patterns[0];
  if (!pick) { console.error(`\nNo pattern "${partArg}"`); process.exit(1); }
  const bars = toBars(pick), bar = bars[(+barArg || 1) - 1];
  if (!bar) { console.error(`\n"${pick.part}" has ${bars.length} bar(s)`); process.exit(1); }
  const snare = bar.map(c => (CODES[c] || { v: 0 }).v);
  const kick = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0];
  console.log(`\nUsing "${pick.part}" bar ${(+barArg || 1)} of ${bars.length} · ${pick.bpm} BPM`);
  console.log(`backing: { kick: [${kick.join(',')}], snare: [${snare.join(',')}] },`);
  emit({
    found: true, url: src, song: unescape(tab.song_name || ''), artist: unescape(tab.artist_name || ''),
    version: tab.version, votes: tab.votes, rating: tab.rating, tonality: tab.tonality_name || null,
    patterns: patterns.map(p => { let bars = []; try { bars = nativeBars(p).map(b => text(b, p.denuminator / 4)); } catch (e) {} return { part: p.part, bpm: p.bpm, subdivision: p.denuminator, triplet: !!p.is_triplet, bars }; }),
    pick: { part: pick.part, bar: +barArg || 1, of: bars.length, bpm: pick.bpm },
    backing: { kick, snare },
  });
})().catch(e => { if (global.__emit) global.__emit({ found: false, reason: e.message }); console.error('Error: ' + e.message); process.exit(1); });
