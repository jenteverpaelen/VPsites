/**
 * Optimaliseert de portretfoto als die aanwezig is.
 *
 * Zet je foto in public/jente.jpg (of .jpeg, .png, .webp). Dit script maakt
 * er AVIF en WebP van op twee breedtes, en PortretJente.astro pikt dat
 * vanzelf op. Staat er geen foto, dan doet dit script niets en valt de site
 * terug op het typografische portret.
 *
 * Draait mee in `npm run prebuild`.
 */

import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const publiek = join(wortel, 'public');
const uit = join(publiek, 'portret');

/** Eerste die bestaat wint. */
const kandidaten = ['jente.jpg', 'jente.jpeg', 'jente.png', 'jente.webp'];

/**
 * Weergavebreedtes. De foto staat maximaal ongeveer 460px breed op /over,
 * dus 960 dekt ook schermen met dubbele pixeldichtheid.
 */
const BREEDTES = [480, 960];

const bron = kandidaten.map((naam) => join(publiek, naam)).find(existsSync);

if (!bron) {
  console.log('[foto] geen public/jente.jpg gevonden, portret valt terug op de tekstversie.');
  process.exit(0);
}

await mkdir(uit, { recursive: true });

const origineel = sharp(bron).rotate(); // rotate() past de EXIF-oriëntatie toe
const meta = await origineel.metadata();

// Vierkant bijsnijden naar 4:5 vanuit het midden bovenaan, want daar zit
// bij een portret het gezicht.
const verhouding = 4 / 5;
const gemaakt = [];

for (const breedte of BREEDTES) {
  const hoogte = Math.round(breedte / verhouding);

  for (const [formaat, opties] of [
    ['avif', { quality: 62, effort: 6 }],
    ['webp', { quality: 78 }],
    ['jpg', { quality: 82, mozjpeg: true }],
  ]) {
    const bestand = join(uit, `jente-${breedte}.${formaat}`);
    await sharp(bron)
      .rotate()
      .resize(breedte, hoogte, { fit: 'cover', position: 'top' })
      [formaat === 'jpg' ? 'jpeg' : formaat](opties)
      .toFile(bestand);
    gemaakt.push(`${breedte}.${formaat}`);
  }
}

// Afmetingen wegschrijven zodat het component width en height kan zetten
// zonder sharp te moeten aanroepen tijdens het renderen.
await writeFile(
  join(uit, 'meta.json'),
  JSON.stringify(
    {
      breedtes: BREEDTES,
      verhouding: '4 / 5',
      bron: `${meta.width}x${meta.height}`,
    },
    null,
    2
  )
);

console.log(`[foto] ${gemaakt.length} varianten gemaakt uit ${meta.width}x${meta.height}.`);
