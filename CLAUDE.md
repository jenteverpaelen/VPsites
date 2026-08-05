# CLAUDE.md — VPsites

**Lees dit volledig voor je iets doet. Ook bij een kleine wijziging.**
Dit bestand is de bron van waarheid voor merk, stem, design, techniek en SEO.
Wijkt code hiervan af, dan is de code fout, niet dit bestand.

---

## 1. Het merk

| | |
|---|---|
| Naam | **VPsites** (één woord, hoofdletter V en P, kleine s). Nooit VPdesign, dat was bezet |
| Persoon | **Jente Ver Paelen**. Drie woorden, "Ver Paelen" is de familienaam |
| Vorm | Eenmanszaak in bijberoep, Vlaanderen |
| Product | Statische websites voor eenmanszaken en heel kleine bedrijven |
| Belofte | Vaste prijs, geen btw, geen abonnement, klaar in 3 dagen tot een week |
| Toon | Eerlijk, direct, nuchter. Een vakman die met een vakman praat |

**Altijd "ik", nooit "wij".** Er is geen team. "Wij" is de leugen die elke concurrent vertelt en het is meteen te doorzien. "Ik" is het hele verkoopargument.

Entiteitsnaam consistent houden, ook om AI-zoekmachines te helpen koppelen: altijd letterlijk "VPsites" en "Jente Ver Paelen", nooit "ons bureau", "het team" of "wij bij VPsites".

---

## 2. Stemregels

De site mag onder geen beding als AI-output lezen. Dit is een expliciete opdracht van de klant.

### Verboden

**Leestekens**

- **Geen gedachtestreepjes.** Geen `—`, geen `–`, geen ` -- `. Splits de zin of gebruik een komma of punt. Dit is de meest herkenbare AI-tell in het Nederlands
- Geen `;` in lopende copy. Klinkt geschreven, niet gesproken
- Geen uitroeptekens in bodycopy. Hooguit één op de hele site, en waarschijnlijk nul

**Emoji en iconen**

- Geen 🚀 💡 ✨ ⚡ 🎯 ✅ 🔒 of welke emoji dan ook in de copy
- Geen generieke icoontjesrij bij features

**Woorden en wendingen die nergens mogen staan**

```
in het huidige digitale landschap      naadloos
ontgrendel / unlock                    moeiteloos
til je bedrijf naar een hoger niveau   op maat gemaakte oplossingen
in een wereld waar                     het is belangrijk op te merken dat
duik in                                laten we eens kijken naar
game changer                           next level
krachtig / robuust / geavanceerd       state of the art
wij geloven dat                        jouw succes is ons succes
transformeer                           revolutionair
"niet alleen ..., maar ook ..."        "of het nu ... is of ..."
```

**Structuurpatronen die AI verraden**

- Drie kaarten naast elkaar met "Snel / Veilig / Responsive" en een icoontje boven elke titel
- Elke sectie exact even lang
- Elke lijst exact drie items
- Een conclusieparagraaf die de sectie samenvat die je net gelezen hebt

### Verplicht

- **Korte zinnen.** Gemiddeld onder 14 woorden. Wissel af met een zin van drie woorden
- **Concrete cijfers.** "€300" en "2 weken", niet "betaalbaar" en "snel". Een getal is bewijs, een bijvoeglijk naamwoord is ruis. Werkt ook voor AEO: modellen citeren cijfers, geen adjectieven
- **Vlaams register.** zelfstandige, stiel, bijberoep, gsm, factuur, btw-nummer, gemeente. Niet: ZZP, mobiel, MKB, ondernemer met een missie
- **Bezwaren benoemen voor de bezoeker ze denkt.** "Je doet dit in bijberoep, wat als je stopt?" staat letterlijk op de site, met een eerlijk antwoord
- **Zeggen wat je níet doet.** AI schrijft nooit op wat het weigert. Dat maakt het een sterk menselijk signaal én het kwalificeert leads

### Toets voor je copy schrijft

Zou Jente dit zo tegen een schrijnwerker zeggen aan de toog? Nee? Herschrijven.

---

## 3. Design tokens

Gedefinieerd in `src/styles/global.css` onder `@theme`. Nooit hardcoded hex in componenten.

```css
--color-mint:      #79E4AC   /* uit het logo */
--color-mint-dim:  #4FBF89

--color-ink:       #0A0C0B   /* pagina-achtergrond */
--color-panel:     #121514   /* kaarten */
--color-raise:     #1A1E1C   /* hover, verhoogde vlakken */
--color-line:      #262C29   /* randen */

--color-fg:        #F2F5F3   /* primaire tekst */
--color-muted:     #9BA4A0   /* secundaire tekst */
--color-faint:     #848C88   /* labels, metadata */
```

### Twee weergaven

Donker is de site. Licht is een keuze achter de knop in de nav, en de standaard
blijft donker, ook als het toestel op licht staat. Alleen een klik verandert het.

De lichte set staat onder `:root[data-thema='licht']` in `global.css` en
overschrijft alleen wat anders moet. **Mint kan daar niet blijven zoals het is:**
`#79E4AC` haalt op wit 1,6:1. In het licht gaat het accent naar `#0A6B3D`, een
donkere groen uit dezelfde familie. Nog altijd één accent.

Let op bij `bg-mint-deep/25` en dergelijke: dat mengt de token met de
achtergrond, en die achtergrond verschilt per weergave. Elke nieuwe combinatie
van mint-op-mint-deep opnieuw nameten. `#D8F1E4` is het donkerste mengsel dat
voorkomt.

Het attribuut wordt blokkerend gezet door het enige inline script op de site, in
`Base.astro`. Zonder dat script zie je bij elke paginawissel een donkere flits.

### De layout is een zichtbaar constructieraster

Dit is sinds augustus 2026 de structuur van de site, en het is meer dan een
stijl. Uit het onderzoek naar wat een techsite in 2026 geloofwaardig maakt komt
één patroon er duidelijk bovenuit: een zichtbaar raster van haarlijnen, de
zogenaamde blueprint grid. De reden dat het werkt: *een raster zegt systeem, het
zegt dat dit met opzet gebouwd is, op maat, door iemand die wist wat hij deed.*
Precies wat deze site moet uitstralen.

Hoe het in elkaar zit:

- **Twee verticale rails** op de randen van de container, over de volle hoogte
  van de inhoud. Staan in `Base.astro` als `raster-rails`, absoluut binnen een
  `raster`-wikkel om `<main>`
- **De sectieregels zijn schermbreed** en lopen dwars door die rails heen. Op elk
  snijpunt krijg je zo een kruis, en dat is wat het als tekening laat lezen in
  plaats van als een stapel banden
- **Kolomlijnen** op een derde en twee derde, pas vanaf `xl`
- **Vanaf `md`.** Onder 768px is er geen ruimte voor een goot, en een haarlijn
  tegen de schermrand wordt afgesneden door de ronde hoeken van een gsm

**De belangrijkste regel: het raster mag nauwelijks te zien zijn.** Je voelt het
voor je het opmerkt. Wordt het duidelijker dan de `line`-token, dan is het
decoratie geworden en werkt het tegen. Het onderzoek is daar expliciet over:
boven ongeveer 15 procent dekking is het te sterk.

### Elke sectie via `Sectie.astro`

Bouw een sectie nooit meer met de hand. Als de layout een zichtbaar raster is,
moet elke sectie op exact dezelfde lijnen vallen, en één sectie die zijn eigen
padding of goot kiest breekt dat meteen zichtbaar.

```astro
<Sectie nr="03" comment="geen offerte nodig, het staat er gewoon">
  ...
</Sectie>
```

`Sectie` bezit de regel bovenaan, de container en het grid. Links een goot met
het sectienummer dat meeloopt terwijl je scrollt, rechts de inhoud. Die goot is
de asymmetrie van de pagina: de inhoud begint niet aan de linkerrand.

De nummers zijn de identiteit van de sectie, niet de positie op de pagina. Prijzen
is altijd `03`, ook op `/prijzen` waar het bovenaan staat. Zo hoef je bij het
herschikken van de home geen nummers om te gooien.

### Textuur

Over de hele site ligt filmkorrel: een SVG met `feTurbulence` als data-URI op
`body::after`, opacity 0,05. Nul verzoeken, nul KB extra. Dit is het enige dat
een groot effen vlak van plat naar tastbaar brengt, en het ontbreken ervan is
precies wat een site die verder klopt toch gedateerd doet aanvoelen.

### De één-accent-regel

**Mint is de enige accentkleur.** Geen tweede accent, geen gradient tussen twee kleuren, geen paars, geen blauw. AI-output gebruikt bijna altijd twee of drie accenten plus een gradient. Eén accent is de goedkoopste manier om er niet als AI uit te zien.

**Eén accent betekent niet: een schuchter accent.** Die twee heb ik in de eerste
versie van dit bestand door elkaar gehaald. Er stond "nooit als groot gevuld
vlak, nooit als achtergrond van een sectie", en het gevolg was een site waar
mint alleen nog in haarlijnen en kleine tekst voorkwam. Op een bijna zwarte
pagina leest dat als een site die zijn eigen kleur niet durft te gebruiken.

Wat nu geldt:

- **Eén vol mint vlak per pagina, niet meer.** Het is het brandpunt, dus twee
  brandpunten is nul brandpunten. Op de home is dat het contactblok onderaan
- Tekst op mint is `--color-ink`, nooit `--color-fg`. Gebruik de utilities
  `op-mint` en `op-mint-zacht`. Nagemeten: 12,6:1 en 9:1 in het donker, 6,4:1 en
  5,1:1 in het licht
- Op een mint vlak geen `comment-mono` of `label-mono` gebruiken. Die zetten
  zelf `color` op faint, en faint op mint haalt 1,9:1. Twee utilities die
  dezelfde property zetten worden door Tailwind gesorteerd en niet door de
  volgorde in je class-attribuut, dus je ziet in de regel niet wie wint. Schrijf
  de opmaak daar uit
- Verder blijft mint voor interactie (links, knoppen, focus), nadruk (één woord
  in een kop), de logo-brackets en de lijn in de proces-pipeline
- Nog altijd geen gradient tussen twee kleuren. Mint naar transparant mag,
  want dat is één kleur

### Typografie

| Rol | Font | Gebruik |
|---|---|---|
| Display en UI | **Archivo Variable** | koppen, knoppen, bodytekst |
| Mono | **JetBrains Mono Variable** | labels, cijfers, metadata, codeframes, `//` comments |

Beide zelf-gehost in `public/fonts/`, enkel het latin-subset, samen 76 KB. **Nooit Google Fonts via CDN**, dat is een extra request, een privacylek en tegen het verhaal van de site.

Archivo heeft ook een breedte-as, maar die versie weegt 88 KB tegenover 35 KB voor gewicht alleen. Niet waard. **Het typografische handschrift is contrast, niet breedte:**

- Koppen groot, gewicht 600 tot 700, `letter-spacing: -0.03em`. Strak en zwaar
- Mono-labels klein, hoofdletters, `letter-spacing: 0.15em`. Wijd en rustig

Die spanning tussen samengeperste koppen en uitgerekte labels is het handschrift. Grote koppen nooit uitrekken met `transform: scaleX()`, dat vervormt de stokken.

**Nooit Inter.** Inter is het standaardfont van elke AI-designtool en de snelste manier om generiek te lijken.

### Spacing

Tailwind-schaal. Container `max-w-6xl`, gutters `px-5` mobiel en `px-8` vanaf md.

Sectie-ritme: `sectie` is de basis, `py-20` mobiel en `py-32` desktop. Maar
**niet elke sectie mag die basis krijgen.** Deel 2 noemt "elke sectie exact even
lang" zelf als AI-patroon, en dan is één uniforme spacing-regel precies dat
patroon in code gieten. Daarom staan er drie:

| Utility | Wanneer |
|---|---|
| `sectie` | de standaard, het meeste |
| `sectie-krap` | korte secties die tegen de vorige aan mogen liggen |
| `sectie-ruim` | een brandpunt dat lucht nodig heeft, zoals het mint blok |

Gebruik ze om de pagina te laten ademen in een ongelijk ritme. Als je door de
home scrollt en elke band voelt even lang, dan is er iets fout.

---

## 4. Harde grenzen

Niet onderhandelbaar. Wordt er één gebroken, dan klopt de belofte van de site niet meer.

| Grens | Waarde |
|---|---|
| JS op de homepage | **onder 20 KB** ongecomprimeerd, na build gemeten |
| LCP | onder 1,2s (Google-drempel is 2,5s) |
| INP | onder 100ms (drempel 200ms) |
| CLS | 0,00 (drempel 0,1) |
| Lighthouse | 100 / 100 / 100 / 100, mobiel én desktop |
| Toegankelijkheid | WCAG 2.1 AA |
| Contrast | minimaal 4.5:1 voor tekst, 3:1 voor UI-componenten |
| Raakvlakken | minimaal 48×48 CSS-px, 8px tussenruimte |
| Cookies | **nul**. Geen enkele. Daarom ook geen cookiebanner |
| localStorage | één sleutel, `vp-thema`, de gekozen weergave. Verlaat het toestel nooit en is niet te volgen. Verder niets |
| Trackers van derden | nul, behalve cookieloze Cloudflare Web Analytics |

De site verkoopt snelheid. Haalt de site die cijfers zelf niet, dan is de site een leugen. Dit is de reden dat er geen React in zit.

---

## 5. Stack

### Gebruiken

```
Astro 7                 static output
Tailwind CSS 4          via @tailwindcss/vite
TypeScript              strict
Content Collections     zod-schema's
@fontsource-variable    zelf-gehoste fonts
@astrojs/sitemap
sharp                   AVIF + WebP tijdens build
wrangler                deploy naar Cloudflare Workers
```

Deploy: **Cloudflare Workers**, niet Pages. `dist/` gaat als statische assets
naar de edge en Cloudflare bedient die rechtstreeks. Daarvoor staat één Worker
uit `worker/`, en die komt alleen aan de beurt voor `/api/contact`.

**Geen Astro-adapter**, en dat is een keuze. Het formulier heeft één server-kant
nodig en die past in dertig regels. Een adapter zou daarvoor een hele runtime
meebouwen en de build van statisch naar server duwen. Koppeling tussen `dist/` en
de Worker staat in `wrangler.jsonc`.

Controleren zonder te uploaden: `npx wrangler deploy --dry-run`.

### Niet gebruiken

| Niet | Waarom |
|---|---|
| `@astrojs/tailwind` | deprecated voor Tailwind v4. Gebruik `@tailwindcss/vite` |
| `tailwind.config.js` | bestaat niet meer in v4. Tokens in CSS onder `@theme` |
| React, Vue, Svelte | een component-framework kost meer KB dan de hele site mag wegen |
| Google Fonts CDN | extra request, privacylek, tegen het verhaal |
| Cookies, localStorage voor tracking | nul cookies is een verkoopargument |
| Een CSS-animatiebibliotheek | CSS `animation-timeline: view()` kost 0 KB |
| Icoonbibliotheken | de weinige iconen worden inline SVG, handgeschreven |

Interactiviteit is vanilla TypeScript in kleine islands onder `src/components/islands/`. Elke island moet zichzelf rechtvaardigen in KB.

---

## 6. Mobiel

**Mobile-first is hier letterlijk.** Bouw op 375px, schaal daarna op. Google indexeert sinds juli 2024 uitsluitend de mobiele versie, dus de mobiele versie *is* de site.

- Sticky actiebalk onderaan op mobiel: Bellen en Mailen, altijd in de duimzone
- Primaire CTA's in de onderste schermhelft
- Body en inputs minimaal `16px`, anders zoomt iOS in bij focus
- `dvh` in plaats van `vh`
- `viewport-fit=cover` plus `env(safe-area-inset-*)`
- Geen interactie enkel achter `:hover`. Elke hover heeft een `:focus-visible`-equivalent
- `overflow-x: clip` op body
- Nav is een volledig scherm overlay, sluitbaar met Escape
- Tabellen worden gestapelde kaarten onder `sm`. Nooit horizontaal scrollen
- Cursor-glow en de `⌘K`-hint alleen achter `@media (pointer: fine)`

Testbreedtes: **320 · 375 · 390 · 430 · 768 · 1024 · 1280 · 1536**.

---

## 7. SEO-checklist per pagina

Een pagina is pas af als dit allemaal klopt.

- [ ] Eén `<h1>`, daaronder een logische `h2`/`h3`-hiërarchie. Geen kop gebruikt voor styling
- [ ] `title` onder 60 tekens, zoekwoord vooraan, met de hand geschreven
- [ ] `description` onder 155 tekens, met een reden om te klikken
- [ ] Zelfverwijzende absolute `canonical`
- [ ] OG- en Twitter-tags, `og:locale` is `nl_BE`, OG-beeld gegenereerd tijdens de build
- [ ] Passende JSON-LD uit `src/lib/schema.ts`, geen los geschreven schema
- [ ] `BreadcrumbList` op elke pagina behalve de home
- [ ] Nederlandse URL met zoekwoord: `/website-laten-maken-prijs`, niet `/page-2`
- [ ] Minimaal twee interne links, waarvan één omhoog naar `/prijzen` of `/contact`
- [ ] Elke `h2` is een echte vraag, en de eerste 40 tot 60 woorden eronder beantwoorden ze direct en citeerbaar (AEO)
- [ ] Alle beelden hebben `width`, `height` en een zinvolle `alt`. LCP-beeld krijgt `fetchpriority="high"` en géén `loading="lazy"`
- [ ] Semantische HTML: `<article>`, `<section>`, `<dl>` voor FAQ, echte `<table>` voor prijzen

### Schema, wat waar hoort

| Type | Waar |
|---|---|
| `ProfessionalService` | in de layout, op elke pagina, met vast `@id` |
| `Person` (Jente) | in de layout, gekoppeld als `founder` |
| `Service` + `Offer` + `priceSpecification` | `/prijzen`, met de échte bedragen |
| `FAQPage` | home en `/prijzen` |
| `BreadcrumbList` | elke subpagina |
| `Article` | elk kennisartikel, met `author`, `datePublished`, `dateModified` |

**Nooit `aggregateRating` op de eigen organisatie.** Dat is tegen het beleid van Google en er zijn nog geen reviews. Niets verzinnen.

**FAQPage geeft géén rich results meer.** Google heeft het op 7 mei 2026 volledig gedeprecieerd, ook voor overheids- en gezondheidssites die het na de beperking van augustus 2023 nog hadden. Het schema blijft geldig en Bingbot, PerplexityBot en de RAG-crawlers lezen het nog. We houden het dus, maar exact onder de voorwaarde die Google zelf stelt: alleen wanneer het echte, zichtbare FAQ-inhoud beschrijft. Dat is hier zo. **Nooit aan een klant verkopen als "dan kom je met sterretjes in Google".**

### AEO

Dit is voor een nieuwe site zonder autoriteit belangrijker dan klassieke SEO. Uit de cijfers:

- Slechts **38%** van de citaties in AI Overviews komt van pagina's die in de Google-top-10 staan (Ahrefs, maart 2026). Je hoeft dus niet te ranken om geciteerd te worden
- De tien grootste domeinen nemen samen maar **12%** van alle citaties (Profound, 730k gesprekken). Specifieke, feitelijke pagina's van kleine domeinen worden constant geciteerd
- Slechts 11% van de domeinen wordt door zowel ChatGPT als Perplexity geciteerd

Dat is precies de opening voor VPsites: tegen Digimi opranken op "website laten maken prijs" duurt jaren, maar geciteerd worden met een concrete, feitelijke pagina kan meteen.

Wat dat concreet betekent voor elke pagina:

- Antwoord-eerst schrijven. Elke `h2` een echte vraag, eronder 40 tot 60 woorden die ze volledig beantwoorden
- Cijfers boven adjectieven. "€300, klaar in 2 weken" wordt geciteerd, "betaalbaar en snel" niet
- Entiteitsnaam altijd letterlijk "VPsites" en "Jente Ver Paelen"
- Genummerde lijsten en vergelijkingstabellen. Dat is het meest geciteerde formaat
- `public/robots.txt` laat GPTBot, ClaudeBot, PerplexityBot en Google-Extended expliciet toe

**Over `llms.txt`, eerlijk:** het staat erin omdat het twintig regels kost, niet omdat het werkt. Google heeft in juli 2025 bevestigd het niet te ondersteunen en dat ook niet van plan te zijn. Van 500 miljoen gemeten AI-bot-bezoeken vroegen er 408 het bestand op. Geen enkele grote AI-aanbieder heeft toegezegd het te lezen. Coding-agents en MCP-servers halen het wel op. **Nooit aan een klant verkopen als SEO-voordeel.**

### Visual Stability Index

Google introduceerde begin 2026 de VSI, die visuele stabiliteit over de hele sessie meet, inclusief tijdens het scrollen. Nog geen ranking-factor, maar dat wordt het waarschijnlijk binnen 12 tot 18 maanden. Praktisch gevolg, nu al toepassen: **scroll-animaties mogen alleen `transform` en `opacity` animeren.** Nooit `height`, `margin`, `top` of iets anders dat de layout herberekent.

Ter info voor de motivatie: sinds Google op 18 maart 2026 bevestigde dat INP een volwaardig ranking-signaal is, verloren sites met een INP boven 200ms gemiddeld 0,8 posities.

---

## 8. Juridisch, verplicht op de site

Belgische wetgeving. Ontbreekt er iets, dan is de site niet conform.

- Handelsnaam **VPsites** en de naam **Jente Ver Paelen**
- Maatschappelijk adres zoals geregistreerd in de KBO
- **Ondernemingsnummer** (KBO)
- E-mailadres of contactformulier
- `/privacy` en `/cookies`
- `/algemene-voorwaarden`

### Btw-formulering, letterlijk overnemen

```
Kleine onderneming onderworpen aan de vrijstellingsregeling van belasting.
BTW niet toepasselijk, artikel 56bis van het BTW-Wetboek.
```

Dit is wettelijk verplicht op de facturen. Op de site is het meteen het sterkste verkoopargument dat er staat: een concurrent die "€995 excl. btw" vraagt, rekent in werkelijkheid €1.204 aan. Bij VPsites is €250 gewoon €250.

Drempel van de regeling is €25.000 omzet per jaar. Wordt die overschreden, dan moet alle prijscommunicatie herzien worden.

**Alle echte bedrijfsgegevens staan in `src/data/bedrijf.ts`.** Nergens anders hardcoden. Wat nog niet ingevuld is, staat daar als `TODO:` en mag niet verzonnen worden.

---

## 9. Waar staat wat

```
CLAUDE.md                     dit bestand
wrangler.jsonc                dist/ als assets plus de Worker ervoor
worker/
  index.ts                    routeert /api/contact, rest naar de assets
  contact.ts                  formulierlogica, honeypot en Resend
  env.ts                      eigen typering, geen workers-types
public/
  robots.txt  llms.txt  favicon.svg  apple-touch-icon.png  site.webmanifest
src/
  components/
    islands/                  vanilla TS, kost KB, moet zich verantwoorden
  content/
    werk/  kennis/  config.ts zod-schema's
  data/
    bedrijf.ts                KBO, adres, gsm, mail, gemeenten. Enige bron
    prijzen.ts                alle bedragen. Enige bron
    faq.ts
  layouts/  pages/
  lib/
    schema.ts                 alle JSON-LD
    seo.ts                    title, description, canonical, OG
    mail.ts                   verzendlogica, swapbaar
  styles/global.css           @theme tokens
```

Regel: **prijzen, bedrijfsgegevens en FAQ staan in `src/data/`, nooit in een component.** Een prijs wijzigen mag maar op één plaats hoeven.

Drie uitzonderingen, want die kunnen geen TypeScript importeren. Wijzig je een
prijs of een levertijd, loop deze drie na:

- `scripts/og.mjs`, de tekstregel onder de titel op de OG-kaarten
- `public/llms.txt`
- de `title` en `description` van `src/pages/index.astro` en `src/pages/prijzen.astro`

### Geen sturende elementen

Er staat geen "meest gekozen" op een prijskaart en geen pakket is uitgelicht.
Alle drie de kaarten zien er identiek uit. Dat is een expliciete keuze van
Jente: hij wil mensen niet in een richting duwen. Zet dat er niet terug in.

---

## 10. Commando's

```bash
npm run dev        # dev server
npm run build      # productiebuild
npm run preview    # build lokaal bekijken
npm run check      # astro check, TypeScript
```

---

## 11. Checklist voor je begint

1. Dit bestand gelezen
2. Gaat het over een prijs, een bedrijfsgegeven of een FAQ? Dan wijzig je `src/data/`, niet een component
3. Nieuwe pagina? Neem de SEO-checklist uit deel 7 erbij voor je begint, niet achteraf
4. Nieuwe copy? Lees de verboden lijst uit deel 2 opnieuw. Zeker de regel over gedachtestreepjes
5. Nieuwe interactiviteit? Vraag eerst of het zonder JS kan. Meestal wel

## Checklist voor je "klaar" zegt

1. `npm run build` draait zonder fouten of waarschuwingen
2. Bekeken op 320px en op 1536px. Geen horizontale scroll, geen afgesneden tekst
3. Alleen met het toetsenbord doorlopen. Focus altijd zichtbaar, nergens vast blijven zitten
4. `prefers-reduced-motion: reduce` aan. Alles staat stil en blijft leesbaar
5. JS-payload gemeten. Home onder 20 KB
6. Geen gedachtestreepje, geen emoji, geen woord uit de verboden lijst in nieuwe copy
7. Niets verzonnen. Geen fictieve klant, geen fictieve review, geen fictief cijfer
