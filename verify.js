// ponytail: one-shot check that the HTML DATA/EDGES match the source PDF.
// run: node verify.js   (mintatanterv.txt = a forrás PDF pdftotext -layout kimenete)
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const txt  = fs.readFileSync(process.argv[2] || 'mintatanterv.txt', 'utf8');

const grab = k => {
  const a = html.indexOf('const ' + k + ' = [');
  const b = html.indexOf('\n];', a);
  return eval(html.slice(a + ('const ' + k + ' = ').length, b + 2));
};
const DATA = grab('DATA'), EDGES = grab('EDGES');

// PDF rows: "<eval> <kredit> <EA> <GY>" in document order (summary rows carry no eval token)
const pdfRows = [...txt.matchAll(/\b(gyj|v|ai)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/gm)]
  .map(m => [m[1], +m[2], +m[3], +m[4]]);
const subjects = DATA.flatMap(c => c.subjects);
const htmlRows = subjects.map(s => [s.ev, s.kr, s.ea, s.gy]);

let bad = 0;
const fail = m => { console.log(m); bad++; };
if (pdfRows.length !== htmlRows.length) fail(`COUNT ${pdfRows.length} pdf vs ${htmlRows.length} html`);
htmlRows.forEach((h, i) => {
  const p = pdfRows[i];
  if (!p || p.join('|') !== h.join('|')) fail(`ROW ${i} ${subjects[i].n}: pdf=${p} html=${h}`);
});

DATA.forEach(c => {
  const t = c.subjects.reduce((a, s) => [a[0]+s.kr, a[1]+s.ea, a[2]+s.gy], [0,0,0]);
  const want = (c.sum.match(/\d+/g) || []).map(Number);
  if (t.join('|') !== want.join('|')) fail(`SUM ${c.label}: header=${want} cards=${t}`);
});

const sem = {}; DATA.forEach((c, i) => c.subjects.forEach(s => sem[s.id] = i));
const seen = new Set();
EDGES.forEach(([f, t]) => {
  if (!(f in sem) || !(t in sem)) fail(`EDGE unknown id ${f}->${t}`);
  else if (sem[t] <= sem[f]) fail(`EDGE not forward ${f}->${t}`);
  if (seen.has(f + t)) fail(`EDGE dup ${f}->${t}`);
  seen.add(f + t);
});

console.log(`${htmlRows.length} subjects, ${EDGES.length} edges, ${bad} problem(s)`);
process.exit(bad ? 1 : 0);
