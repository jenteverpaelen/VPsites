/**
 * Maakt de PNG-iconen uit public/favicon.svg.
 *
 * Draait mee in `npm run prebuild`, net als de OG-kaarten.
 *
 * Waarom dit een script is en geen bestand dat je één keer exporteert: bij het
 * omgooien van het palet stond de favicon nog op de oude kleuren, en de twee
 * PNG's ook. Een SVG die de bron is en PNG's die daaruit vallen, kunnen niet meer
 * los van elkaar lopen. Dat is precies het soort fout dat je zelf nooit opmerkt,
 * want je eigen tabblad is de plek waar je het minst naar kijkt.
 *
 * apple-touch-icon krijgt geen doorzichtige achtergrond: iOS zet daar zwart
 * achter en dan is het merkteken niet meer te zien.
 */

import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const publiek = join(hier, '..', 'public');

const bron = await readFile(join(publiek, 'favicon.svg'));

const maten = [
  ['apple-touch-icon.png', 180],
  ['icon-512.png', 512],
];

const gemaakt = await Promise.all(
  maten.map(async ([naam, maat]) => {
    await sharp(bron, { density: 384 })
      .resize(maat, maat, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .flatten({ background: '#E8734F' })
      .png({ compressionLevel: 9 })
      .toFile(join(publiek, naam));
    return `${naam} (${maat}px)`;
  })
);

console.log(`[iconen] ${gemaakt.join(', ')} uit favicon.svg`);
