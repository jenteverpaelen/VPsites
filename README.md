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

- **Je foto** als `public/jente.jpg`. Meer niet. Bij de volgende
  `npm run build` maakt [`scripts/foto.mjs`](scripts/foto.mjs) er AVIF, WebP en
  JPEG van, en [`PortretJente.astro`](src/components/PortretJente.astro)
  schakelt vanzelf over. Zolang er geen foto staat, toont de site een
  typografisch portret in plaats van een leeg vak.

  Het script schaalt nooit op. Is je foto 960 breed, dan krijg je een uitsnede
  tot 768 breed en niet groter, want uitrekken maakt hem alleen zachter. Welke
  breedtes er gemaakt zijn komt in `public/portret/meta.json` te staan, en het
  component leest dat. Wil je een scherper portret op een scherm met hoge
  pixeldichtheid, zet er dan een foto van minstens 1600 pixels breed in.
- **Je domeinnaam** in [`src/data/site.mjs`](src/data/site.mjs) en onderaan
  `public/robots.txt`.
- **Je eerste klantproject** zodra het af is: kopieer
  [`_sjabloon.md`](src/content/werk/_sjabloon.md) in `src/content/werk/`.

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

Donker is de site. De knop in de balk zet het op licht, en die keuze blijft in
`localStorage` staan onder `vp-thema`. Geen cookie, dus de belofte onderaan de
site blijft kloppen.

De lichte set staat in [`global.css`](src/styles/global.css) onder
`:root[data-thema='licht']`. Wijzig je daar een kleur, meet het contrast dan na.
Mint is in het licht een donkere groen, want de mint uit het logo haalt op wit
1,6:1 en dat is onleesbaar.

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
   **aan** (oranje wolkje). Zonder proxy kan een Redirect Rule niet vuren
2. Rules → Redirect Rules → Create. Als `hostname` gelijk is aan
   `www.vpsites.be`, dan een **301** naar
   `concat("https://vpsites.be", http.request.uri.path)`

Twee hostnames die allebei de site tonen is dubbele content. De canonicals
wijzen al naar de apex, maar een redirect is duidelijker dan Google laten kiezen.

### E-mail op het domein

`hallo@vpsites.be` staat op de site, in de JSON-LD en in de footer. Dat adres
moet dus echt bestaan, en daar heb je MX-records voor nodig. Gratis via
Cloudflare: **Email → Email Routing** → aanzetten, dan een adres toevoegen dat
doorstuurt naar je gewone mailbox. Cloudflare zet de MX- en TXT-records er zelf
bij.

Dat is voor mail **ontvangen**. Om via het formulier te kunnen **versturen** moet
je `vpsites.be` nog verifiëren bij Resend. Die geeft je een paar DKIM- en
SPF-records om toe te voegen. Doe dat voor je `MAIL_VAN` instelt, anders weigert
Resend de verzending.

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
