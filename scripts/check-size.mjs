/**
 * Bewaakt het JS-budget.
 *
 * De site verkoopt snelheid. Haalt ze haar eigen cijfers niet, dan klopt het
 * verkoopargument niet meer. Daarom is dit een harde grens en geen richtlijn.
 * Zie CLAUDE.md deel 4.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const dist = join(wortel, 'dist');

/** Ongecomprimeerde JS per pagina, in KB. */
const BUDGET_JS = 20;
/** Volledige homepagina over de lijn, gecomprimeerd, zonder fonts. */
const BUDGET_PAGINA = 60;

async function bestanden(map, ext) {
  const gevonden = [];
  for (const item of await readdir(map, { withFileTypes: true })) {
    const pad = join(map, item.name);
    if (item.isDirectory()) gevonden.push(...(await bestanden(pad, ext)));
    else if (extname(item.name) === ext) gevonden.push(pad);
  }
  return gevonden;
}

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

try {
  const scripts = await bestanden(dist, '.js');
  let totaalJs = 0;

  for (const script of scripts) {
    const grootte = (await stat(script)).size;
    totaalJs += grootte;
    console.log(`  ${kb(grootte).toString().padStart(6)} KB  ${relative(dist, script)}`);
  }

  const css = await bestanden(dist, '.css');
  let totaalCss = 0;
  for (const blad of css) totaalCss += (await stat(blad)).size;

  const home = join(dist, 'index.html');
  const homeHtml = await readFile(home);
  const homeGz = gzipSync(homeHtml).length;
  const cssGz = totaalCss > 0 ? gzipSync(await readFile(css[0])).length : 0;
  const jsGz = totaalJs > 0 ? gzipSync(Buffer.concat(await Promise.all(scripts.map((s) => readFile(s))))).length : 0;

  console.log('');
  console.log(`  JavaScript      ${kb(totaalJs)} KB  (gzip ${kb(jsGz)} KB)   budget ${BUDGET_JS} KB`);
  console.log(`  CSS             ${kb(totaalCss)} KB  (gzip ${kb(cssGz)} KB)`);
  console.log(`  Home HTML       ${kb(homeHtml.length)} KB  (gzip ${kb(homeGz)} KB)`);
  console.log(`  Home totaal     gzip ${kb(homeGz + cssGz + jsGz)} KB   budget ${BUDGET_PAGINA} KB`);
  console.log('');

  let fout = false;

  if (kb(totaalJs) > BUDGET_JS) {
    console.error(`JS-budget overschreden: ${kb(totaalJs)} KB tegenover ${BUDGET_JS} KB.`);
    fout = true;
  }

  if (kb(homeGz + cssGz + jsGz) > BUDGET_PAGINA) {
    console.error(
      `Paginabudget overschreden: ${kb(homeGz + cssGz + jsGz)} KB tegenover ${BUDGET_PAGINA} KB.`
    );
    fout = true;
  }

  if (fout) {
    console.error('Zie CLAUDE.md deel 4. Dit is een harde grens.');
    process.exit(1);
  }

  console.log('[budget] alles binnen de grenzen.');
} catch (e) {
  if (e.code === 'ENOENT') {
    console.error('Geen dist/ gevonden. Draai eerst `npm run build`.');
    process.exit(1);
  }
  throw e;
}
