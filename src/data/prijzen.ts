/**
 * De enige bron voor prijzen. Zie CLAUDE.md deel 9.
 *
 * Introductieprijs voor de eerste klanten, met de normale prijs ernaast.
 * Zo is de lage prijs een reden om nu te reageren, en geen signaal over
 * kwaliteit. Wil je de introductie stoppen: zet `introductie` op false.
 */

export const introductie = {
  actief: true,
  plaatsen: 5,
  // TODO(jente): tel af naarmate je klanten binnenhaalt.
  plaatsenOver: 5,
  uitleg: 'Introductieprijs voor mijn eerste vijf klanten. Daarna gaat de normale prijs in.',
} as const;

export type Pakket = {
  id: string;
  naam: string;
  regel: string;
  prijs: number;
  prijsNormaal: number | null;
  vanaf: boolean;
  levertijd: string;
  paginas: string;
  voor: string;
  bevat: string[];
  uitgelicht: boolean;
};

export const pakketten: Pakket[] = [
  {
    id: 'onepager',
    naam: 'Onepager',
    regel: 'Eén pagina die alles vertelt',
    prijs: 180,
    prijsNormaal: 390,
    vanaf: false,
    levertijd: '1 week',
    paginas: '1 lange pagina',
    voor: 'Je hebt nog niets online en je wil vooral gevonden worden en gebeld worden.',
    bevat: [
      'Eén lange pagina met alles erop',
      'Contactformulier dat in je mailbox toekomt',
      'Klikbaar telefoonnummer en adres',
      'Werkt op gsm, tablet en laptop',
      'Vindbaar in Google op je naam en je stiel',
      'Je logo verwerkt, of een tekstlogo als je er geen hebt',
      'Ik zet je domeinnaam en hosting op',
    ],
    uitgelicht: false,
  },
  {
    id: 'starter',
    naam: 'Starter',
    regel: 'Een volwaardige site van vier tot vijf pagina\'s',
    prijs: 300,
    prijsNormaal: 650,
    vanaf: false,
    levertijd: '2 weken',
    paginas: '4 tot 5 pagina\'s',
    voor: 'Je wil je diensten apart uitleggen, je werk tonen, en professioneel overkomen.',
    bevat: [
      'Alles uit de Onepager',
      'Vier tot vijf aparte pagina\'s',
      'Aparte pagina per dienst, goed voor je vindbaarheid',
      'Fotogalerij van je werk',
      'Basis-SEO: titels, beschrijvingen, sitemap, Google-koppeling',
      'Je Google Bedrijfsprofiel mee in orde gezet',
      'Privacy- en cookiebeleid, wettelijk in orde',
    ],
    uitgelicht: true,
  },
  {
    id: 'op-maat',
    naam: 'Op maat',
    regel: 'Meer pagina\'s, meer talen, of iets dat moet koppelen',
    prijs: 600,
    prijsNormaal: null,
    vanaf: true,
    levertijd: 'in overleg',
    paginas: '6 of meer',
    voor: 'Je hebt iets specifieks nodig. Een tweede taal, een agenda, een koppeling.',
    bevat: [
      'Alles uit Starter',
      'Zoveel pagina\'s als nodig',
      'Tweede taal (Frans of Engels)',
      'Online reservatie of afsprakenmodule',
      'Koppeling met wat je al gebruikt',
      'We spreken de prijs op voorhand af, en die verandert niet',
    ],
    uitgelicht: false,
  },
];

/** Losse opties, prijs per stuk. */
export const opties = [
  { naam: 'Extra pagina', prijs: 40, eenheid: 'per pagina' },
  { naam: 'Tweede taal', prijs: 120, eenheid: 'voor de hele site' },
  { naam: 'Ik schrijf je teksten', prijs: 90, eenheid: 'voor de hele site' },
  { naam: 'Google Bedrijfsprofiel opzetten', prijs: 45, eenheid: 'eenmalig' },
  { naam: 'Eenvoudig tekstlogo', prijs: 60, eenheid: 'eenmalig' },
  { naam: 'Jaarlijkse opfrisbeurt', prijs: 50, eenheid: 'per jaar, geen abonnement' },
];

/**
 * Terugkerende kosten. Radicaal eerlijk zijn hierover is het punt.
 * Zie het onderzoek: WordPress-onderhoud kost 600 tot 1500 euro per jaar.
 */
export const terugkerend = {
  domein: { bedrag: 15, per: 'jaar', wat: 'Je domeinnaam, bijvoorbeeld jouwzaak.be' },
  hosting: { bedrag: 0, per: 'jaar', wat: 'Gratis op Cloudflare. Een statische site heeft geen server nodig' },
  onderhoud: { bedrag: 0, per: 'jaar', wat: 'Geen. Er is geen WordPress, dus geen plugins die stukgaan' },
};

export const geenAbonnement =
  'Ik verkoop geen onderhoudsabonnement. Je betaalt één keer voor je site, en daarna alleen je domeinnaam.';

export const prijsBereik = `€${Math.min(...pakketten.map((p) => p.prijs))} tot €${Math.max(...pakketten.map((p) => p.prijs))}+`;
