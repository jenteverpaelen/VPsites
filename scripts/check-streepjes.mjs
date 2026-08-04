/**
 * Bewaakt de belangrijkste anti-AI-regel van dit project.
 *
 * De klant vroeg expliciet: geen gedachtestreepjes. Dat is in het Nederlands
 * de meest herkenbare AI-tell. Deze controle draait over de gebouwde HTML,
 * dus ze pakt ook streepjes die de markdown-processor zelf toevoegt.
 *
 * Draait mee in `npm run check`.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const dist = join(wortel, 'dist');

/** Em dash, en dash, horizontal bar, minus sign. */
const STREEPJES = /[—–―−]/;

/** Zoekwoorden die er nooit mogen staan. Zie CLAUDE.md deel 2. */
const VERBODEN = [
  'digitaal landschap',
  'digitale landschap',
  'ontgrendel',
  'naadloze',
  'naadloos',
  'moeiteloos',
  'hoger niveau tillen',
  'op maat gemaakte oplossing',
  'state of the art',
  'game changer',
  'revolutionair',
  'jouw succes is ons succes',
];

/** Emoji-bereiken die in de copy niet thuishoren. */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]/u;

async function bestanden(map) {
  const gevonden = [];
  for (const item of await readdir(map, { withFileTypes: true })) {
    const pad = join(map, item.name);
    if (item.isDirectory()) gevonden.push(...(await bestanden(pad)));
    else if (extname(item.name) === '.html') gevonden.push(pad);
  }
  return gevonden;
}

/** Alleen de zichtbare tekst controleren, geen script- of stijlinhoud. */
function zichtbareTekst(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

let problemen = 0;

try {
  for (const bestand of await bestanden(dist)) {
    const tekst = zichtbareTekst(await readFile(bestand, 'utf8'));
    const naam = relative(wortel, bestand);

    for (const [i, regel] of tekst.split('\n').entries()) {
      if (STREEPJES.test(regel)) {
        console.error(`${naam}:${i + 1}  gedachtestreepje: ${regel.trim().slice(0, 90)}`);
        problemen++;
      }
      if (EMOJI.test(regel)) {
        console.error(`${naam}:${i + 1}  emoji: ${regel.trim().slice(0, 90)}`);
        problemen++;
      }
    }

    const klein = tekst.toLowerCase();
    for (const woord of VERBODEN) {
      if (klein.includes(woord)) {
        console.error(`${naam}  verboden woord: "${woord}"`);
        problemen++;
      }
    }
  }
} catch (fout) {
  if (fout.code === 'ENOENT') {
    console.error('Geen dist/ gevonden. Draai eerst `npm run build`.');
    process.exit(1);
  }
  throw fout;
}

if (problemen > 0) {
  console.error(`\n${problemen} probleem(en) gevonden. Zie CLAUDE.md deel 2.`);
  process.exit(1);
}

console.log('[stem] geen gedachtestreepjes, geen emoji, geen verboden woorden.');
