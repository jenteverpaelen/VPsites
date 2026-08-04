/**
 * Loopt de SEO-checklist uit CLAUDE.md deel 7 af over elke gebouwde pagina.
 *
 * Dit vervangt geen Search Console, maar het vangt wel precies de fouten
 * die je anders pas maanden later ontdekt: een dubbele title, een ontbrekende
 * canonical, twee h1's, of een description van 300 tekens.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const dist = join(wortel, 'dist');

const MAX_TITLE = 60;
const MAX_DESC = 155;

async function bestanden(map) {
  const gevonden = [];
  for (const item of await readdir(map, { withFileTypes: true })) {
    const pad = join(map, item.name);
    if (item.isDirectory()) gevonden.push(...(await bestanden(pad)));
    else if (extname(item.name) === '.html') gevonden.push(pad);
  }
  return gevonden;
}

const pak = (html, re) => html.match(re)?.[1]?.trim();
const alle = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const problemen = [];
const waarschuwingen = [];
const titels = new Map();
const descripties = new Map();

for (const bestand of await bestanden(dist)) {
  const html = await readFile(bestand, 'utf8');
  const naam = relative(dist, bestand).replace(/\\/g, '/');
  const noindex = /name="robots"[^>]*noindex/.test(html);

  const meld = (tekst) => problemen.push(`${naam}: ${tekst}`);
  const let_op = (tekst) => waarschuwingen.push(`${naam}: ${tekst}`);

  // Taal
  if (!/<html[^>]+lang="nl-BE"/.test(html)) meld('lang is niet nl-BE');

  // Title
  const title = pak(html, /<title>([^<]*)<\/title>/);
  if (!title) meld('geen title');
  else {
    if (title.length > MAX_TITLE) let_op(`title is ${title.length} tekens (max ${MAX_TITLE})`);
    if (!noindex) {
      if (titels.has(title)) meld(`title is dubbel met ${titels.get(title)}`);
      titels.set(title, naam);
    }
  }

  // Description
  const desc = pak(html, /<meta name="description" content="([^"]*)"/);
  if (!desc) meld('geen meta description');
  else {
    if (desc.length > MAX_DESC) let_op(`description is ${desc.length} tekens (max ${MAX_DESC})`);
    if (!noindex) {
      if (descripties.has(desc)) meld(`description is dubbel met ${descripties.get(desc)}`);
      descripties.set(desc, naam);
    }
  }

  // Canonical
  const canonical = pak(html, /<link rel="canonical" href="([^"]*)"/);
  if (!canonical) meld('geen canonical');
  else if (!canonical.startsWith('https://')) meld('canonical is niet absoluut');

  // Koppen
  const h1s = alle(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1s.length === 0) meld('geen h1');
  if (h1s.length > 1) meld(`${h1s.length} h1-elementen`);

  // Open Graph
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:locale']) {
    if (!html.includes(`property="${tag}"`)) meld(`ontbrekende ${tag}`);
  }

  // Schema
  const ld = pak(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!ld) meld('geen JSON-LD');
  else {
    try {
      const data = JSON.parse(ld);
      const types = (data['@graph'] ?? []).map((n) => n['@type']);
      if (!types.includes('ProfessionalService')) meld('geen ProfessionalService in de graaf');
      const plat = JSON.stringify(data);
      if (plat.includes('aggregateRating')) meld('aggregateRating op de eigen organisatie');
      if (plat.includes('TODO')) let_op('TODO-tekst zit in de JSON-LD');
    } catch (e) {
      meld(`JSON-LD is ongeldig: ${e.message}`);
    }
  }

  // Afbeeldingen
  for (const img of html.match(/<img[^>]*>/g) ?? []) {
    if (!/\salt=/.test(img)) meld(`img zonder alt: ${img.slice(0, 70)}`);
    if (!/\swidth=/.test(img) || !/\sheight=/.test(img)) {
      let_op(`img zonder width/height, risico op layout shift: ${img.slice(0, 70)}`);
    }
  }

  // Placeholders die nooit live mogen
  if (/TODO\(jente\)/.test(html)) let_op('TODO(jente) staat in de uitvoer');
}

const toon = (lijst, kop) => {
  if (lijst.length === 0) return;
  console.log(`\n${kop}`);
  for (const regel of lijst) console.log(`  ${regel}`);
};

toon(waarschuwingen, 'Waarschuwingen:');
toon(problemen, 'Problemen:');

console.log('');
if (problemen.length > 0) {
  console.error(`[seo] ${problemen.length} probleem(en), ${waarschuwingen.length} waarschuwing(en).`);
  process.exit(1);
}
console.log(`[seo] alles in orde. ${waarschuwingen.length} waarschuwing(en).`);
