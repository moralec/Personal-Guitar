#!/usr/bin/env node
// check.js <song.json> <index.html> [strum.json] — deterministic checks on one pipeline output.
// Prints PASS / WARN / FAIL lines; exit 1 if any FAIL.
const fs = require('fs');
const [, , jsonPath, indexPath, strumPath] = process.argv;

// Pull CHORD_SHAPES and the transposer straight from the app so the check matches what renders
const html = fs.readFileSync(indexPath, 'utf8');
const grab = (start, endMarker) => { const a = html.indexOf(start); return html.slice(a, html.indexOf(endMarker, a) + endMarker.length); };
const ctx = {};
new Function('ctx', [
  grab('const CHORD_SHAPES', '\n};'),
  grab('const NOTE_IDX', ';'), grab('const NOTE_SHARP', ';'), grab('const NOTE_FLAT ', ';'), grab('const NOTE_DEFAULT', ';'),
  grab('function spellRoot', '\n}'), grab('function transposeChord', '\n}'),
  'ctx.CHORD_SHAPES = CHORD_SHAPES; ctx.transposeChord = transposeChord;',
].join('\n'))(ctx);

const out = [];
const res = (lvl, msg) => out.push(`${lvl.padEnd(4)} ${msg}`);
let d;
try { d = JSON.parse(fs.readFileSync(jsonPath, 'utf8')); } catch (e) { console.log('FAIL json: ' + e.message); process.exit(1); }

const KEYS = ['title', 'artist', 'chart_url', 'tab_url', 'key', 'capo', 'tuned_down_semitone', 'bpm', 'bpm_source', 'chords', 'lesson', 'warmup', 'notes'];
const missing = KEYS.filter(k => !(k in d));
missing.length ? res('FAIL', 'missing keys: ' + missing.join(', ')) : res('PASS', 'all top-level keys present');

// Chords
const sec = d.chords && d.chords.sections, seq = d.chords && d.chords.sequence;
if (!sec || !seq) res('FAIL', 'chords.sections / chords.sequence missing');
else {
  let bars = 0, bad = [];
  for (const [k, s] of Object.entries(sec)) for (const b of s.bars || []) { bars++; if (!Array.isArray(b) || b.length !== 4 || b.some(c => typeof c !== 'string' || !c)) bad.push(`${k}:${JSON.stringify(b)}`); }
  bad.length ? res('FAIL', `bars not 4 chord names: ${bad.slice(0, 3).join(' ')}`) : res('PASS', `${Object.keys(sec).length} sections, ${bars} bars, all 4 beats`);
  const undef = seq.filter(x => !sec[x.key]).map(x => x.key);
  undef.length ? res('FAIL', 'sequence refers to missing sections: ' + undef.join(', ')) : res('PASS', `sequence of ${seq.length} parts, all sections exist`);
  const unused = Object.keys(sec).filter(k => !seq.some(x => x.key === k));
  if (unused.length) res('WARN', 'sections never used in sequence: ' + unused.join(', '));
  const names = [...new Set(Object.values(sec).flatMap(s => (s.bars || []).flat()))];
  const noShape = names.filter(n => !ctx.CHORD_SHAPES[n]);
  const noGl = names.filter(n => ctx.CHORD_SHAPES[n] && !ctx.CHORD_SHAPES[ctx.transposeChord(n, -5)]).map(n => `${n}→${ctx.transposeChord(n, -5)}`);
  res(noShape.length ? 'WARN' : 'PASS', `chords ${names.join(' ')}${noShape.length ? ' · no diagram: ' + noShape.join(' ') : ' · all have diagrams'}`);
  if (noGl.length) res('WARN', 'no guitarlele diagram for: ' + noGl.join(' '));
  const long = names.filter(n => n.length > 10);
  if (long.length) res('FAIL', 'suspicious chord names (lyrics?): ' + long.join(' | '));
}

// Capo
if ('capo' in d) Number.isInteger(d.capo) && d.capo >= 0 && d.capo <= 9 ? res('PASS', `capo ${d.capo}`) : res('FAIL', `capo ${d.capo}`);

// Strumming: from strum-from-ug.js (pipeline/strum/<slug>.json), not from the model
const sj = strumPath && fs.existsSync(strumPath) ? JSON.parse(fs.readFileSync(strumPath, 'utf8')) : null;
const st = sj && sj.found ? { ...sj.backing, pattern: sj.patterns[0] && sj.patterns[0].bars[0], source: sj.url } : (d.strum || {});
if (sj && sj.found && typeof d.bpm === 'number' && Math.abs(sj.pick.bpm - d.bpm) > 8 && Math.abs(sj.pick.bpm - d.bpm * 2) > 8 && Math.abs(sj.pick.bpm * 2 - d.bpm) > 8)
  res('WARN', `bpm ${d.bpm} vs chart strumming ${sj.pick.bpm}`);
const ok16 = a => Array.isArray(a) && a.length === 16 && a.every(v => typeof v === 'number' && v >= 0 && v <= 1);
if (sj && !sj.found) res('PASS', `no strumming pattern (${sj.reason}): the session hides the strumming step`);
else ok16(st.kick) && ok16(st.snare) ? res('PASS', `strum "${st.pattern}" · source ${st.source}`) : res('FAIL', 'strum.kick / strum.snare not 16 values in 0..1');

// BPM
typeof d.bpm === 'number' && d.bpm >= 40 && d.bpm <= 220 ? res('PASS', `bpm ${d.bpm} (${d.bpm_source})`) : res('FAIL', `bpm ${d.bpm}`);

(async () => {
  // YouTube: confirm each id exists and show its real title + channel
  for (const which of ['lesson', 'warmup']) {
    const v = d[which];
    if (!v || !v.videoId) { res('FAIL', `${which}: no videoId`); continue; }
    try {
      const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${v.videoId}&format=json`);
      if (!r.ok) { res('FAIL', `${which} ${v.videoId}: does not exist (HTTP ${r.status})`); continue; }
      const o = await r.json();
      const chanOk = !v.channel || o.author_name.toLowerCase().includes(String(v.channel).toLowerCase().slice(0, 6));
      res(chanOk ? 'PASS' : 'WARN', `${which} ${v.videoId}: "${o.title}" by ${o.author_name}${chanOk ? '' : ` (claimed ${v.channel})`}`);
    } catch (e) { res('WARN', `${which}: oEmbed check failed: ${e.message}`); }
  }
  // Chart / tab URLs reachable
  for (const k of ['chart_url', 'tab_url', 'bpm_source']) {
    const u = d[k]; if (!u || !/^https?:/.test(u)) { if (k !== 'tab_url') res('WARN', `${k}: ${u}`); continue; }
    try { const r = await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } }); res(r.ok ? 'PASS' : 'WARN', `${k} HTTP ${r.status} ${u}`); }
    catch (e) { res('WARN', `${k} unreachable: ${u}`); }
  }
  console.log(out.join('\n'));
  process.exit(out.some(l => l.startsWith('FAIL')) ? 1 : 0);
})();
