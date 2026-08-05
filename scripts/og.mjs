/**
 * Genereert de OG-kaarten in public/og/.
 *
 * Draait automatisch voor elke build via het prebuild-script.
 *
 * Let op: sharp rendert SVG via librsvg en dat leest geen ingebed woff2.
 * Archivo is hier dus niet beschikbaar en de tekst staat in Arial Bold.
 * Dat is ook een neo-grotesk en op 1200x630 zie je het verschil niet.
 * Alle andere vormgeving, kleur en het VP-merkteken, is wel identiek.
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const uit = join(hier, '..', 'public', 'og');

/* Dezelfde tokens als in global.css, maar dan de donkere set. Een OG-kaart
   volgt de weergavekeuze van de bezoeker niet, dus die is altijd donker.
   Wijzigen de tokens, wijzig ze hier mee. */
const MINT = '#79E4AC';
const INK = '#0A0C0B';
const FG = '#F2F5F3';
const MUTED = '#9BA4A0';
const LINE = '#262C29';

/* De bedragen hieronder staan ook in src/data/prijzen.ts. Dit is een .mjs die
   tijdens de prebuild draait en geen TypeScript kan importeren, dus dit is de
   enige plek buiten src/data/ waar een prijs mag staan. Pas je een prijs aan,
   pas dan ook deze twee regels aan. */
const kaarten = {
  home: {
    label: 'VPSITES',
    regels: ['Een site die laadt', 'vóór je ademt.'],
    onder: 'Vanaf €150 · geen btw · geen abonnement',
  },
  prijzen: {
    label: 'VPSITES / PRIJZEN',
    regels: ['Alle prijzen', 'staan gewoon online.'],
    onder: 'Onepager €150 · Starter €250 · geen btw',
  },
  werk: {
    label: 'VPSITES / WERK',
    regels: ['Klein, en dat', 'mag geweten zijn.'],
    onder: 'Introductieprijs zolang ik mijn portfolio opbouw',
  },
  over: {
    label: 'VPSITES / OVER',
    regels: ['Dag, ik ben Jente.'],
    onder: 'Websites in bijberoep, uit passie',
  },
  contact: {
    label: 'VPSITES / CONTACT',
    regels: ['Vertel me', 'wat je doet.'],
    onder: 'Eén zin volstaat. Antwoord binnen de dag',
  },
  kennis: {
    label: 'VPSITES / KENNIS',
    regels: ['Eerlijke uitleg', 'over websites.'],
    onder: 'Wat het kost, wat moet, en wat niet',
  },
};

/** & en < breken de SVG als ze onbewerkt in tekst staan. */
const veilig = (tekst) =>
  tekst.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function bouwSvg({ label, regels, onder }) {
  const grootte = regels.length > 1 ? 82 : 92;
  const start = regels.length > 1 ? 300 : 330;

  const titel = regels
    .map(
      (regel, i) =>
        `<text x="80" y="${start + i * (grootte * 1.06)}" font-family="Arial, Helvetica, sans-serif"
           font-size="${grootte}" font-weight="700" letter-spacing="-3" fill="${FG}">${veilig(regel)}</text>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="raster" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="1" fill="${LINE}"/>
    </pattern>
    <radialGradient id="gloed" cx="18%" cy="0%" r="75%">
      <stop offset="0%" stop-color="${MINT}" stop-opacity="0.11"/>
      <stop offset="100%" stop-color="${MINT}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vervaag" x1="0" y1="0" x2="0.9" y2="0.8">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="rastermasker">
      <rect width="1200" height="630" fill="url(#vervaag)"/>
    </mask>
  </defs>

  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="1200" height="630" fill="url(#raster)" mask="url(#rastermasker)"/>
  <rect width="1200" height="630" fill="url(#gloed)"/>

  <!-- Merkteken linksboven, uitgetekend zodat het niet van een font afhangt. -->
  <g transform="translate(80, 74) scale(1.5)">
    <path fill="${FG}" d="M0 0h9.1l2.4 20.1L13.9 0H23l-11.5 32.1H11z"/>
    <path fill="${FG}" fill-rule="evenodd" d="M27 0h12.9c5.2 0 8.9 3.7 8.9 9s-3.7 9-8.9 9h-5.1v14.1H27zm7.8 7v4.3h4.3c1.5 0 2.4-.9 2.4-2.1s-.9-2.2-2.4-2.2z"/>
    <path stroke="${MINT}" stroke-width="6.2" stroke-linecap="round" d="M65 1.2 57.6 30.9"/>
  </g>

  <text x="80" y="176" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="19"
        letter-spacing="5.5" fill="#6B7370">${veilig(label)}</text>

  ${titel}

  <rect x="80" y="486" width="64" height="4" rx="2" fill="${MINT}"/>

  <text x="80" y="546" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="${MUTED}">${veilig(onder)}</text>

  <text x="1120" y="546" text-anchor="end" font-family="Consolas, 'DejaVu Sans Mono', monospace"
        font-size="19" letter-spacing="1.5" fill="#6B7370">vpsites.be</text>
</svg>`;
}

await mkdir(uit, { recursive: true });

const gemaakt = await Promise.all(
  Object.entries(kaarten).map(async ([naam, kaart]) => {
    await sharp(Buffer.from(bouwSvg(kaart)))
      .png({ compressionLevel: 9, palette: true })
      .toFile(join(uit, `${naam}.png`));
    return naam;
  })
);

console.log(`[og] ${gemaakt.length} kaarten gemaakt: ${gemaakt.join(', ')}`);
