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

- ondernemingsnummer (KBO)
- adres zoals geregistreerd
- gsm-nummer en e-mailadres
- gemeenten waar je werkt, dat stuurt je lokale vindbaarheid
- LinkedIn en GitHub, als je die hebt

Verder:

- **Je foto** in `public/jente.jpg`, en `heeftFoto` op `true` in
  [`PortretJente.astro`](src/components/PortretJente.astro). Tot dan staat er
  een typografisch portret, geen lege doos.
- **Je domeinnaam** in [`src/data/site.mjs`](src/data/site.mjs) en onderaan
  `public/robots.txt`.
- **Je eerste klantproject** zodra het af is: kopieer
  [`_sjabloon.md`](src/content/werk/_sjabloon.md) in `src/content/werk/`.

## Prijzen aanpassen

Alleen in [`src/data/prijzen.ts`](src/data/prijzen.ts). Dat bestand voedt de
prijskaarten, de command palette, de JSON-LD en de OG-kaarten.

Stopt de introductieactie? Zet `introductie.actief` op `false`. De doorstreepte
bedragen en het badge verdwijnen dan overal tegelijk.

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

Cloudflare Pages, gekoppeld aan de GitHub-repo. Elke push naar `main` zet dan
vanzelf een nieuwe versie live, en elke pull request krijgt een eigen
voorbeeld-URL.

- Build command: `npm run build`
- Output directory: `dist`

De map `functions/` wordt automatisch opgepikt en bedient `/api/contact`.
Zet deze variabelen in de Pages-instellingen:

| Variabele | Waarvoor |
|---|---|
| `RESEND_API_KEY` | de mail versturen. Zonder deze krijgt de bezoeker een nette melding |
| `MAIL_NAAR` | jouw mailbox |
| `MAIL_VAN` | afzender op een geverifieerd domein |
| `TURNSTILE_SECRET` | optioneel, extra spamcontrole |

Het formulier werkt niet in `npm run dev`, want Pages Functions draaien daar
niet. Je krijgt dan een melding die dat zegt.

Na het live gaan: dien `sitemap-index.xml` in bij Google Search Console en Bing
Webmaster Tools, en zet de verificatiecode in
[`Base.astro`](src/layouts/Base.astro). Daar staat ook de plek voor het
Cloudflare Web Analytics-token.
