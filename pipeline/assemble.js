#!/usr/bin/env node
// assemble.js — write the BUILT block in index.html from every song that passed check.js.
// Reads out/<slug>.json (DeepSeek), strum/<slug>.json (strum-from-ug.js) and out/<slug>.check.txt.
// Songs with a FAIL in their check are left out and listed. Usage: node pipeline/assemble.js [--dry]
const fs = require('fs'), path = require('path');
const P = __dirname, INDEX = path.join(P, '..', 'index.html');
const dry = process.argv.includes('--dry');
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const built = {}, skipped = [];
for (const f of fs.readdirSync(path.join(P, 'out')).filter(f => f.endsWith('.json')).sort()) {
  const slug = f.replace(/\.json$/, '');
  const checkFile = path.join(P, 'out', slug + '.check.txt');
  const check = fs.existsSync(checkFile) ? fs.readFileSync(checkFile, 'utf8') : '';
  if (!check || /^FAIL/m.test(check)) { skipped.push(`${slug}: ${check ? check.split('\n').filter(l => l.startsWith('FAIL')).join('; ') : 'not checked'}`); continue; }
  const d = read(path.join(P, 'out', f));
  const strumFile = path.join(P, 'strum', slug + '.json');
  const sj = fs.existsSync(strumFile) ? read(strumFile) : { found: false };
  const yt = v => v && v.videoId ? v : null;
  const links = [];
  if (d.tab_url) links.push({ label: '🎸 Tab', url: d.tab_url });
  if (d.chart_url) links.push({ label: '🎵 Chords', url: d.chart_url });
  if (sj.found && sj.url && sj.url !== d.chart_url) links.push({ label: '🥁 Strumming', url: sj.url });
  built[slug] = {
    bpm: d.bpm, key: d.key, capo: d.capo || 0, defaultPitch: d.tuned_down_semitone ? 1 : 0,
    backing: sj.found ? sj.backing : null,
    warmup: yt(d.warmup) && { videoId: d.warmup.videoId, label: `${d.warmup.channel || 'YouTube'} · YouTube`, title: d.warmup.focus || d.warmup.title, meta: d.warmup.why || '' },
    lesson: yt(d.lesson) && { videoId: d.lesson.videoId, label: `${d.lesson.channel || 'YouTube'} · YouTube` },
    links,
    chords: { sections: d.chords.sections, sequence: d.chords.sequence },
  };
  if (!built[slug].warmup || !built[slug].lesson) { delete built[slug]; skipped.push(`${slug}: missing lesson or warmup video`); }
}

// One song per line block, readable in a diff
const body = Object.entries(built).map(([id, b]) => `  ${JSON.stringify(id)}: ${JSON.stringify(b)},`).join('\n');
const block = `// BUILT:START\nconst BUILT = {\n${body}\n};\n// BUILT:END`;
const html = fs.readFileSync(INDEX, 'utf8');
const a = html.indexOf('// BUILT:START'), b = html.indexOf('// BUILT:END') + '// BUILT:END'.length;
if (a < 0 || b < a) { console.error('BUILT markers not found in index.html'); process.exit(1); }
if (!dry) fs.writeFileSync(INDEX, html.slice(0, a) + block + html.slice(b));
console.log(`${dry ? '[dry] ' : ''}BUILT: ${Object.keys(built).length} songs${skipped.length ? `\nleft out (${skipped.length}):\n  ` + skipped.join('\n  ') : ''}`);
