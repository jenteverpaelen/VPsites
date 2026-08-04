import { bedrijf, adresRegel } from '~/data/bedrijf';
import { pakketten } from '~/data/prijzen';
import type { FaqItem } from '~/data/faq';

/**
 * Alle JSON-LD op één plek. Nooit los schema in een pagina schrijven.
 * Zie CLAUDE.md deel 7.
 *
 * Vaste @id's zodat de entiteiten over de hele site naar elkaar verwijzen
 * in plaats van dat elke pagina een losse, onverbonden organisatie beschrijft.
 */

const ID_BEDRIJF = `${bedrijf.url}/#bedrijf`;
const ID_PERSOON = `${bedrijf.url}/#jente`;
const ID_SITE = `${bedrijf.url}/#website`;

/** Alleen echte, ingevulde profielen. Een lege sameAs is beter dan een dode link. */
const sameAs = bedrijf.profielen.filter(Boolean);

export function persoonSchema() {
  return {
    '@type': 'Person',
    '@id': ID_PERSOON,
    name: bedrijf.persoon,
    givenName: 'Jente',
    familyName: 'Ver Paelen',
    jobTitle: bedrijf.functie,
    url: `${bedrijf.url}/over`,
    email: bedrijf.email,
    telephone: bedrijf.telefoon,
    worksFor: { '@id': ID_BEDRIJF },
    knowsAbout: [
      'Webdesign',
      'Statische websites',
      'Webperformance',
      'Core Web Vitals',
      'Lokale SEO',
      'Toegankelijkheid',
    ],
    knowsLanguage: ['nl-BE', 'en'],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function bedrijfSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': ID_BEDRIJF,
    name: bedrijf.naam,
    legalName: bedrijf.persoon,
    description:
      'Snelle statische websites voor zelfstandigen en kleine bedrijven in Vlaanderen. Vaste prijs, geen btw, geen onderhoudsabonnement.',
    url: bedrijf.url,
    logo: `${bedrijf.url}/icon-512.png`,
    image: `${bedrijf.url}/og/home.png`,
    email: bedrijf.email,
    telephone: bedrijf.telefoon,
    vatID: bedrijf.ondernemingsnummer,
    foundingDate: String(bedrijf.startjaar),
    founder: { '@id': ID_PERSOON },
    address: {
      '@type': 'PostalAddress',
      streetAddress: bedrijf.adres.straat,
      postalCode: bedrijf.adres.postcode,
      addressLocality: bedrijf.adres.gemeente,
      addressCountry: bedrijf.adres.land,
    },
    areaServed: bedrijf.werkgebied.map((naam) => ({
      '@type': 'AdministrativeArea',
      name: naam,
    })),
    priceRange: `€${Math.min(...pakketten.map((p) => p.prijs))} - €${Math.max(...pakketten.map((p) => p.prijs))}+`,
    currenciesAccepted: 'EUR',
    knowsLanguage: ['nl-BE'],
    // Bewust geen aggregateRating: er zijn nog geen reviews en zelf-toegekende
    // scores zijn tegen het beleid van Google. Zie CLAUDE.md deel 7.
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: bedrijf.url,
    name: bedrijf.naam,
    inLanguage: 'nl-BE',
    publisher: { '@id': ID_BEDRIJF },
  };
}

/** Service met echte bedragen. Zeldzaam in schema, en precies wat een
 *  AI nodig heeft om "wat kost een website in België" te beantwoorden. */
export function dienstenSchema() {
  return pakketten.map((pakket) => ({
    '@type': 'Service',
    '@id': `${bedrijf.url}/prijzen#${pakket.id}`,
    name: `${pakket.naam} website`,
    serviceType: 'Webdesign',
    description: pakket.regel,
    provider: { '@id': ID_BEDRIJF },
    areaServed: bedrijf.werkgebied.map((naam) => ({
      '@type': 'AdministrativeArea',
      name: naam,
    })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: pakket.prijs,
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: pakket.prijs,
        priceCurrency: 'EUR',
        // Vrijstellingsregeling kleine ondernemingen: er komt geen btw bij.
        valueAddedTaxIncluded: true,
      },
    },
  }));
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.vraag,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.antwoord,
      },
    })),
  };
}

export function kruimelSchema(kruimels: Array<{ naam: string; pad: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: kruimels.map((kruimel, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: kruimel.naam,
      item: `${bedrijf.url}${kruimel.pad}`,
    })),
  };
}

export function artikelSchema(artikel: {
  titel: string;
  beschrijving: string;
  pad: string;
  gepubliceerd: Date;
  gewijzigd?: Date;
  afbeelding?: string;
}) {
  return {
    '@type': 'Article',
    headline: artikel.titel,
    description: artikel.beschrijving,
    inLanguage: 'nl-BE',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${bedrijf.url}${artikel.pad}` },
    author: { '@id': ID_PERSOON },
    publisher: { '@id': ID_BEDRIJF },
    datePublished: artikel.gepubliceerd.toISOString(),
    dateModified: (artikel.gewijzigd ?? artikel.gepubliceerd).toISOString(),
    image: artikel.afbeelding ?? `${bedrijf.url}/og/home.png`,
  };
}

export function contactSchema() {
  return {
    '@type': 'ContactPage',
    name: `Contact ${bedrijf.naam}`,
    description: `Neem contact op met ${bedrijf.persoon}. Bereikbaar op ${bedrijf.telefoonWeergave} en ${bedrijf.email}. ${adresRegel}.`,
    mainEntity: { '@id': ID_BEDRIJF },
  };
}

/** Bouwt de volledige graaf. Eén script-tag per pagina. */
export function bouwGraaf(extra: object[] = []) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [bedrijfSchema(), persoonSchema(), websiteSchema(), ...extra],
  });
}
