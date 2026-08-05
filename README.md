# VPsites

De website van VPsites, de eenmanszaak van Jente Ver Paelen.
Statische sites voor zelfstandigen en kleine bedrijven in Vlaanderen.

**Lees [CLAUDE.md](CLAUDE.md) voor je iets wijzigt.** Daar staan de merkregels,
de stemregels, de designtokens en de harde grenzen.

## Aan de slag

```bash
npm install
npm run dev
```

| Commando | Wat het doet |
|---|---|
| `npm run dev` | dev server op http://localhost:4321 |
| `npm run build` | productiebuild naar `dist/`, maakt eerst de OG-kaarten |
| `npm run preview` | de build lokaal bekijken |
| `npm run check` | TypeScript, stemregels, SEO-checklist en het JS-budget |
| `npm run og` | alleen de OG-kaarten opnieuw genereren |

`npm run check` faalt bewust hard. Een gedachtestreepje in de copy of een
JS-payload boven 20 KB is geen waarschuwing maar een fout.

## Wat je zelf nog moet invullen

Alles staat op één plaats: [`src/data/bedrijf.ts`](src/data/bedrijf.ts).
Zoek op `TODO` en je hebt ze alle drie.

- **ondernemingsnummer (KBO)**, wettelijk verplicht op de site
- **gsm-nummer en e-mailadres**, nu nog voorbeeldwaarden
- **LinkedIn en GitHub**, als je die hebt. Die gaan naar `sameAs` in de
  JSON-LD en helpen Google je als één persoon te herkennen

Adres en werkgebied staan er al in: Paalseweg 30A, 3980 Tessenderlo, met
Limburg als werkgebied.

Verder:

- **Je domeinnaam** in [`src/data/site.mjs`](src/data/site.mjs) en onderaan
  `public/robots.txt`.
- **Je eerste klantproject** zodra het af is: kopieer
  [`_sjabloon.md`](src/content/werk/_sjabloon.md) in `src/content/werk/`.

### Geen portretfoto

Op de plek van een foto staat een gezet naamkaartje, in
[`PortretJente.astro`](src/components/PortretJente.astro). Dat is een keuze van
Jente en geen ontbrekend bestand, dus zet er geen silhouet of stockbeeld in.

Een foto doet op deze site één ding: aantonen dat er een echt mens achter zit. Dat
werkt ook met een echte naam, een echte gemeente en een echt nummer, en die staan
alle drie op dat kaartje. Voor een lokale Vlaamse koper weegt een nummer dat je
kan bellen even zwaar als een gezicht.

Wil je er later toch een foto in, dan is dat één component en geen bouwstap: er is
geen fotopijplijn meer.

## Prijzen aanpassen

Alleen in [`src/data/prijzen.ts`](src/data/prijzen.ts). Dat bestand voedt de
prijskaarten, de command palette en de JSON-LD.

Stopt de introductieactie? Zet `introductie.actief` op `false`. De doorstreepte
bedragen verdwijnen dan overal tegelijk.

Drie plekken kunnen die file niet importeren, dus die moet je meenemen als je
een prijs of een levertijd wijzigt:

- [`scripts/og.mjs`](scripts/og.mjs), de regel onder de titel op de OG-kaarten
- [`public/llms.txt`](public/llms.txt)
- de `title` en `description` van `src/pages/index.astro` en
  `src/pages/prijzen.astro`

## Donker en licht

Donker is de site: warm houtskool met gebrande klei als accent. De knop in de
balk zet het op papier, en die keuze blijft in `localStorage` staan onder
`vp-weergave`. Geen cookie, dus de belofte onderaan de site blijft kloppen.

Die sleutel heette eerst `vp-thema`. Tijdens de herbouw is de standaard een keer
omgedraaid, en daarmee veranderde de betekenis van de opgeslagen waarde: wie toen
op licht stond, kreeg licht te zien terwijl donker weer de standaard was. Een
sleutel waarvan de betekenis wijzigt hoort een nieuwe naam te krijgen, zodat oude
waarden vervallen in plaats van iets anders te betekenen. Draai je de standaard
ooit nog om, doe dan hetzelfde.

De lichte set staat in [`global.css`](src/styles/global.css) onder
`:root[data-thema='licht']`. Wijzig je daar een kleur, meet het contrast dan na.
Het accent moet daar donkerder: de opgelichte klei van de donkere weergave haalt
op papier maar 2,4:1 en dat is onleesbaar.

## Werken via GitHub

De repo staat op [jenteverpaelen/VPsites](https://github.com/jenteverpaelen/VPsites).

Bij elke push naar `main` en bij elke pull request draait
[`.github/workflows/controle.yml`](.github/workflows/controle.yml): bouwen,
daarna dezelfde vier controles als lokaal. Faalt er iets, dan zie je dat op
het tabblad Actions voor de site live gaat.

Voor een wijziging van enige omvang: werk op een aparte branch en open een
pull request. Dan draait de controle voor je samenvoegt in plaats van erna.

```bash
git switch -c prijzen-aanpassen
# wijzigen, npm run check
git push -u origin prijzen-aanpassen
```

## Online zetten

**Cloudflare Workers**, gekoppeld aan de GitHub-repo. De site is een statische
build in `dist/` die Cloudflare rechtstreeks van de edge bedient. Daarvoor staat
één Worker uit [`worker/`](worker/), en die komt alleen aan de beurt voor
`/api/contact`. De koppeling staat in [`wrangler.jsonc`](wrangler.jsonc).

Instellingen in **Workers & Pages → Create → Import a repository**:

| Veld | Waarde |
|---|---|
| Project name | `vpsites` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Path | `/` |

De Node-versie komt uit [`.nvmrc`](.nvmrc), nu 24, dezelfde als in CI. Pikt
Cloudflare dat niet op, zet dan `NODE_VERSION` op `24` bij de variabelen.

Elke push naar `main` zet vanzelf een nieuwe versie live. Andere branches krijgen
via `versions upload` een eigen voorbeeld-URL, zonder de productieversie aan te
raken.

Controleren of de config klopt zonder iets te uploaden:

```bash
npx wrangler deploy --dry-run
```

Zet deze variabelen bij de Worker onder **Settings → Variables and Secrets**,
en zet de eerste als **Secret** en niet als plain text:

| Variabele | Waarvoor |
|---|---|
| `RESEND_API_KEY` | de mail versturen. Zonder deze krijgt de bezoeker een nette melding |
| `MAIL_NAAR` | jouw mailbox |
| `MAIL_VAN` | afzender op een geverifieerd domein |
| `TURNSTILE_SECRET` | optioneel, extra spamcontrole |

Het formulier werkt niet in `npm run dev`, want de Worker draait daar niet mee.
Je krijgt dan een melding die dat zegt. Wil je het lokaal wél testen, bouw dan
eerst en start de Worker apart:

```bash
npm run build && npx wrangler dev
```

### Je domein eraan hangen

Na de eerste deploy: de Worker → **Settings → Domains & Routes** → Add → Custom
domain → `vpsites.be`. Staat de DNS van dat domein al bij Cloudflare, dan is het
één klik. Zo niet, verhuis eerst de nameservers naar Cloudflare.

Doe dit ook echt, want de `workers.dev`-URL die je bij de eerste deploy krijgt is
niet het domein waar de canonicals naar wijzen. Zet die URL daarna uit, anders
staat de site op twee adressen.

**Voeg voor de site geen DNS-record met de hand toe.** Cloudflare maakt het zelf
aan zodra je het domein aan de Worker hangt, en beheert het daarna. Een eigen
A-record naar een IP zit alleen in de weg.

Voor `www` is er wel handwerk, want `SITE_URL` staat op de apex zonder www:

1. DNS → Add record → type **CNAME**, name `www`, target `vpsites.be`, proxy
   **aan** (oranje wolkje). Zonder proxy gaat het verkeer niet langs Cloudflare
   en kan de volgende stap niet vuren
2. Rules → Redirect Rules → Create. Voorwaarde: `Hostname` **equals**
   `www.vpsites.be`

Kies bij de actie **Dynamic redirect** en niet Static. Dat is de val: een static
redirect stuurt alles naar één vaste URL, dus `www.vpsites.be/prijzen` komt dan
op de homepagina terecht in plaats van op de prijzen. Bij dynamic zet je:

```
concat("https://vpsites.be", http.request.uri.path)
```

Status **301**, en **Preserve query string** aan, anders verdwijnt alles achter
een vraagteken.

Test daarna met een pad en niet met de bare domeinnaam, want een fout in de
expressie zie je alleen daar:

```bash
curl -sI https://www.vpsites.be/prijzen | grep -i "^location"
```

Daar hoort `location: https://vpsites.be/prijzen` te staan.

Twee hostnames die allebei de site tonen is dubbele content. De canonicals
wijzen al naar de apex, maar een redirect is duidelijker dan Google laten kiezen.

### Welke DNS-records er horen te staan

| Record | Waarvoor | Wie zet het |
|---|---|---|
| apex `vpsites.be` | de site | Cloudflare, bij het aanhangen van de Worker |
| `www` CNAME → `vpsites.be` | doorverwijzen naar de apex | jij |
| MX | mail op `@vpsites.be` ontvangen | Cloudflare Email Routing |
| TXT met `v=spf1` | wie namens jou mag verzenden | Email Routing, later aanvullen |
| TXT op `_dmarc` | voorkomen dat iemand je adres misbruikt | jij |
| DKIM | ondertekening van verzonden mail | Resend geeft de waarden |

Niet toevoegen, ook als een blog het aanraadt: CAA (Cloudflare regelt de
certificaten, en een verkeerde CAA blokkeert de uitgifte), een AAAA op de apex
(dat doet de proxy), BIMI (vraagt een certificaat van meer dan duizend euro per
jaar) en MTA-STS. Voor een eenmanszaak leveren die niets op.

### E-mail op het domein

`hallo@vpsites.be` staat op de site, in de JSON-LD en in de footer. Dat adres
moet dus echt bestaan, en daar heb je MX-records voor nodig. Gratis via
Cloudflare: **Email → Email Routing** → aanzetten, dan `hallo@vpsites.be`
toevoegen als adres dat doorstuurt naar je gewone mailbox. Cloudflare zet de MX-
en SPF-records er zelf bij.

Dat sluit ook de kring rond het formulier: `MAIL_NAAR` staat op
`hallo@vpsites.be`, dus een aanvraag komt dan in je echte mailbox terecht.

Dat is voor mail **ontvangen**. Om via het formulier te kunnen **versturen** moet
je `vpsites.be` nog verifiëren bij Resend. Die geeft je exacte DKIM-records. Neem
die letterlijk over en verzin er niets bij. Doe dit voor je `MAIL_VAN` instelt,
anders weigert Resend de verzending.

**Eén SPF-record per domein.** Dat is de klassieke fout: Email Routing zet er een,
en dan komt Resend erbij en zet je een tweede. Twee SPF-records maken de controle
ongeldig en dan komt je mail in de spam. Je voegt de `include:` van Resend toe aan
het bestaande record, je maakt geen nieuw record.

### Voorkomen dat iemand met je adres verzendt

Zonder DMARC kan iedereen mail versturen die van `hallo@vpsites.be` lijkt te
komen. Voeg toe: TXT-record, name `_dmarc`, content:

```
v=DMARC1; p=none; rua=mailto:hallo@vpsites.be; fo=1
```

Begin op `p=none`. Dat verandert nog niets aan de aflevering en je krijgt enkel
rapporten. Staat Resend een paar weken goed te verzenden, zet het dan op
`p=quarantine` en daarna op `p=reject`. Meteen op `reject` beginnen is de manier
om je eigen formuliermail stil te laten verdwijnen.

`SITE_URL` in [`src/data/site.mjs`](src/data/site.mjs) staat op
`https://vpsites.be`, dus **zonder www**. Hang je ook `www.vpsites.be` eraan, zet
daar dan een Redirect Rule op naar de apex. Twee domeinen die allebei antwoorden
is dubbele content.

### Voor je live gaat

Drie dingen in [`src/data/bedrijf.ts`](src/data/bedrijf.ts) staan er nog als
voorbeeldwaarde, en het eerste is een wettelijk probleem:

- **`ondernemingsnummer`** staat op `BE 0000.000.000`. Dat nummer is in België
  verplicht op je site en het staat nu als verzinsel in de footer én in de
  JSON-LD. Vul dit in voor je het domein eraan hangt
- **`telefoon`** en **`telefoonWeergave`** staan op `0470 00 00 00`. De hele site
  zegt "bel me gerust" met een nummer dat niet bestaat
- **`email`** staat op `hallo@vpsites.be`. Dat moet bestaan, anders komt het
  formulier nergens toe

Na het live gaan: dien `sitemap-index.xml` in bij Google Search Console en Bing
Webmaster Tools, en zet de verificatiecode in
[`Base.astro`](src/layouts/Base.astro). Daar staat ook de plek voor het
Cloudflare Web Analytics-token.
