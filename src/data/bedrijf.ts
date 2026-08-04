import { SITE_URL } from './site.mjs';

/**
 * De enige bron voor bedrijfsgegevens.
 * Nergens anders hardcoden. Zie CLAUDE.md deel 8 en 9.
 *
 * Alles met TODO moet Jente invullen. Niets verzinnen: deze gegevens
 * zijn wettelijk verplicht en komen ook in de JSON-LD terecht.
 */
export const bedrijf = {
  naam: 'VPsites',
  persoon: 'Jente Ver Paelen',
  functie: 'Webdesigner en developer',

  url: SITE_URL,

  // TODO(jente): echt gsm-nummer. Formaat E.164 voor tel: en schema.
  telefoon: '+32470000000',
  telefoonWeergave: '0470 00 00 00',

  // TODO(jente): echt e-mailadres op je eigen domein, niet gmail.
  email: 'hallo@vpsites.be',

  adres: {
    straat: 'Paalseweg 30A',
    postcode: '3980',
    gemeente: 'Tessenderlo',
    land: 'BE',
  },

  // TODO(jente): je ondernemingsnummer. Wettelijk verplicht op de site.
  ondernemingsnummer: 'BE 0000.000.000',

  // Btw-vrijstellingsregeling kleine ondernemingen. Letterlijke formulering,
  // niet herschrijven. Zie CLAUDE.md deel 8.
  btwVermelding:
    'Kleine onderneming onderworpen aan de vrijstellingsregeling van belasting. BTW niet toepasselijk, artikel 56bis van het BTW-Wetboek.',
  btwKort: 'Geen btw. Vrijstellingsregeling kleine ondernemingen.',

  // Gaat naar areaServed in de JSON-LD en stuurt je lokale vindbaarheid.
  // Zet hier de gemeenten waar je effectief wil werken. Hoe specifieker,
  // hoe beter je scoort op "webdesigner [gemeente]".
  // TODO(jente): schrappen of aanvullen naar wat je echt wil bedienen.
  werkgebied: [
    'Tessenderlo',
    'Beringen',
    'Ham',
    'Leopoldsburg',
    'Hasselt',
    'Limburg',
  ],

  /** Kort te gebruiken in lopende tekst. */
  regio: 'Limburg',

  // TODO(jente): echte profielen. Leeg laten is beter dan een dode link.
  // Gaat naar sameAs in de JSON-LD, wat Google helpt de entiteit te koppelen.
  profielen: [] as string[],

  startjaar: 2026,
} as const;

export const telHref = `tel:${bedrijf.telefoon}`;
export const mailHref = `mailto:${bedrijf.email}`;

export const adresRegel = `${bedrijf.adres.straat}, ${bedrijf.adres.postcode} ${bedrijf.adres.gemeente}`;
