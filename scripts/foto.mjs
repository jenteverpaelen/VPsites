/**
 * Optimaliseert de portretfoto als die aanwezig is.
 *
 * Zet je foto in public/jente.jpg (of .jpeg, .png, .webp). Dit script maakt
 * er AVIF en WebP van, en PortretJente.astro pikt dat vanzelf op. Staat er
 * geen foto, dan doet dit script niets en valt de site terug op het
 * typografische portret.
 *
 * Het schaalt nooit op. Een foto die kleiner is dan de gevraagde breedte
 * wordt niet uitgerekt, want dat levert alleen een zachter beeld op zonder
 * extra detail. De uiteindelijke breedtes komen in meta.json terecht, zodat
 * het component precies de varianten aanbiedt die er echt zijn.
 *
 * Draait mee in `npm run prebuild`.
 */

import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const hier = dirname(fileURLToPath(import.meta.url));
const wortel = join(hier, '..');
const publiek = join(wortel, 'public');
const uit = join(publiek, 'portret');

/** Eerste die bestaat wint. */
const kandidaten = ['jente.jpg', 'jente.jpeg', 'jente.png', 'jente.webp'];

/** Weergavebreedtes. De foto staat maximaal ongeveer 460px breed op /over,
 *  dus 960 dekt ook schermen met dubbele pixeldichtheid. */
const GEVRAAGD = [480, 960];

/** Portretverhouding. */
const RATIO_B = 4;
const RATIO_H = 5;

const bron = kandidaten.map((naam) => join(publiek, naam)).find(existsSync);

if (!bron) {
  // Oude varianten opruimen, anders blijft een verwijderde foto rondslingeren.
  await rm(uit, { recursive: true, force: true });
  console.log('[foto] geen public/jente.jpg gevonden, portret valt terug op de tekstversie.');
  process.exit(0);
}

const meta = await sharp(bron).rotate().metadata(); // rotate() past de EXIF-oriëntatie toe

// Grootste 4:5-uitsnede die zonder opschalen uit deze bron te halen valt.
const maxBreedte = Math.floor(
  Math.min(meta.width, (meta.height * RATIO_B) / RATIO_H)
);

const breedtes = [...new Set(GEVRAAGD.map((b) => Math.min(b, maxBreedte)))].sort(
  (a, b) => a - b
);

if (breedtes[breedtes.length - 1] < 400) {
  console.warn(
    `[foto] let op: ${meta.width}x${meta.height} levert maar ${maxBreedte}px breed op. ` +
      'Een grotere foto ziet er beter uit op een scherm met hoge pixeldichtheid.'
  );
}

await rm(uit, { recursive: true, force: true });
await mkdir(uit, { recursive: true });

const formaten = [
  ['avif', 'avif', { quality: 62, effort: 6 }],
  ['webp', 'webp', { quality: 78 }],
  ['jpg', 'jpeg', { quality: 82, mozjpeg: true }],
];

for (const breedte of breedtes) {
  const hoogte = Math.round((breedte * RATIO_H) / RATIO_B);
  for (const [extensie, methode, opties] of formaten) {
    await sharp(bron)
      .rotate()
      // position: top, want bij een portret zit het gezicht bovenaan.
      .resize(breedte, hoogte, { fit: 'cover', position: 'top' })
      [methode](opties)
      .toFile(join(uit, `jente-${breedte}.${extensie}`));
  }
}

const grootste = breedtes[breedtes.length - 1];

await writeFile(
  join(uit, 'meta.json'),
  `${JSON.stringify(
    {
      breedtes,
      breedte: grootste,
      hoogte: Math.round((grootste * RATIO_H) / RATIO_B),
      bron: `${meta.width}x${meta.height}`,
    },
    null,
    2
  )}\n`
);

const overgeslagen = GEVRAAGD.filter((b) => b > maxBreedte);
console.log(
  `[foto] ${breedtes.length * formaten.length} varianten uit ${meta.width}x${meta.height}` +
    ` op ${breedtes.join(' en ')} breed` +
    (overgeslagen.length
      ? ` (${overgeslagen.join(' en ')} overgeslagen, dat zou opschalen zijn)`
      : '') +
    '.'
);
