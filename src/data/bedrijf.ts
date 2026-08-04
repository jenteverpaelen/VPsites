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

  // TODO(jente): adres zoals geregistreerd in de KBO.
  adres: {
    straat: 'Straatnaam 1',
    postcode: '2000',
    gemeente: 'Antwerpen',
    land: 'BE',
  },

  // TODO(jente): je ondernemingsnummer. Wettelijk verplicht op de site.
  ondernemingsnummer: 'BE 0000.000.000',

  // Btw-vrijstellingsregeling kleine ondernemingen. Letterlijke formulering,
  // niet herschrijven. Zie CLAUDE.md deel 8.
  btwVermelding:
    'Kleine onderneming onderworpen aan de vrijstellingsregeling van belasting. BTW niet toepasselijk, artikel 56bis van het BTW-Wetboek.',
  btwKort: 'Geen btw. Vrijstellingsregeling kleine ondernemingen.',

  // TODO(jente): de gemeenten waar je effectief werkt. Gaat naar areaServed
  // in de JSON-LD en stuurt je lokale vindbaarheid.
  werkgebied: ['Antwerpen', 'Mechelen', 'Lier', 'Sint-Niklaas', 'Vlaanderen'],

  // TODO(jente): echte profielen. Leeg laten is beter dan een dode link.
  // Gaat naar sameAs in de JSON-LD, wat Google helpt de entiteit te koppelen.
  profielen: [] as string[],

  startjaar: 2026,
} as const;

export const telHref = `tel:${bedrijf.telefoon}`;
export const mailHref = `mailto:${bedrijf.email}`;

export const adresRegel = `${bedrijf.adres.straat}, ${bedrijf.adres.postcode} ${bedrijf.adres.gemeente}`;
