/**
 * De echte bezwaren, niet de makkelijke.
 * Antwoord-eerst geschreven: de eerste zin beantwoordt de vraag volledig,
 * daarna pas de nuance. Dat is wat AI-zoekmachines citeren (CLAUDE.md deel 7).
 *
 * Deze lijst voedt zowel de FAQ-sectie als de FAQPage JSON-LD.
 */

export type FaqItem = {
  vraag: string;
  antwoord: string;
  /** Op welke pagina's tonen. 'home' en 'prijzen' krijgen ook het schema. */
  toon: Array<'home' | 'prijzen'>;
};

export const faq: FaqItem[] = [
  {
    vraag: 'Je doet dit in bijberoep. Wat als je ermee stopt?',
    antwoord:
      'Dan blijft je site gewoon draaien. Dat is precies waarom ik statische sites bouw. Er is geen WordPress dat updates nodig heeft en geen server die iemand moet beheren. Je site staat als kant en klare bestanden op Cloudflare en blijft daar staan, met of zonder mij. De domeinnaam staat op jouw naam, de bestanden krijg je mee. Elke andere webdesigner kan ermee verder. Bij een WordPress-site met een onderhoudscontract zit je wél vast, want zonder onderhoud gaat die na een jaar stuk.',
    toon: ['home', 'prijzen'],
  },
  {
    vraag: 'Waarom ben je zoveel goedkoper dan de rest?',
    antwoord:
      'Omdat mijn kosten lager zijn, niet omdat ik minder doe. Vier redenen. Ik heb geen kantoor en geen team, dus geen overhead die doorgerekend moet worden. Ik val onder de btw-vrijstellingsregeling voor kleine ondernemingen, dus je betaalt geen 21 procent bovenop. Ik bouw statisch, wat sneller gaat dan een WordPress-site met twintig plugins in elkaar steken. En ik doe dit in bijberoep uit passie, niet om er een gezin mee te onderhouden. Een bureau in Hasselt of Antwerpen met twintig man moet die twintig man betalen. Ik niet.',
    toon: ['home', 'prijzen'],
  },
  {
    vraag: 'Kan ik zelf mijn teksten en foto\'s aanpassen?',
    antwoord:
      'Kleine aanpassingen stuur je me door en ik zet ze erop, meestal dezelfde dag nog. Een prijs die verandert, een nieuwe foto, andere openingsuren: dat is voor mij vijf minuten werk en ik reken er niets voor aan in het eerste jaar. Wil je het echt zelf doen, dan kan ik een eenvoudig beheersysteem inbouwen. Dat kost extra en eerlijk gezegd: de meeste zelfstandigen die dat vragen, gebruiken het na twee maanden niet meer. Vraag het gerust, ik zeg je wel of het in jouw geval de moeite is.',
    toon: ['home', 'prijzen'],
  },
  {
    vraag: 'Wat als ik later een webshop wil?',
    antwoord:
      'Dan verwijs ik je door, en dat meen ik. Een echte webshop met voorraad, betalingen en verzendingen is een ander vak en daar ben ik niet de beste keuze voor. Wil je een handvol producten verkopen, dan kan ik dat oplossen met een koppeling naar een betaaldienst. Wil je een volwaardige winkel, dan kom je bij mij aan het verkeerde adres en zeg ik dat liever nu dan achteraf.',
    toon: ['home', 'prijzen'],
  },
  {
    vraag: 'Wat heb ik nodig voor we kunnen beginnen?',
    antwoord:
      'Je naam, wat je doet, en een manier om je te bereiken. Meer niet om te starten. Foto\'s zijn fijn maar niet verplicht, ik werk desnoods met wat je op je gsm hebt staan. Teksten schrijf ik mee als je dat wil. De meeste mensen blokkeren op "ik moet eerst nog alles klaarleggen" en dan gebeurt er een jaar lang niets. Stuur gewoon wat je hebt, de rest lossen we onderweg op.',
    toon: ['home', 'prijzen'],
  },
  {
    vraag: 'Hoelang duurt het echt?',
    antwoord:
      'Een onepager drie tot vier dagen, een Starter één week, gerekend vanaf het moment dat ik je teksten en foto\'s heb. Die laatste zin is belangrijk. In de praktijk duurt het langer bij mensen die hun foto\'s pas na drie weken doorsturen. Ik hou je op de hoogte en je krijgt een link waarop je live kan volgen hoe het vordert.',
    toon: ['prijzen'],
  },
  {
    vraag: 'Wat als ik niet tevreden ben?',
    antwoord:
      'Je ziet het ontwerp voor ik begin te bouwen, en je betaalt de helft pas bij oplevering. Na het eerste ontwerp krijg je twee rondes aanpassingen, ruim genoeg om het juist te krijgen. Bevalt het ontwerp je helemaal niet, dan stoppen we daar en betaal je alleen het voorschot. Ik ga je niet laten betalen voor iets waar je niet achter staat.',
    toon: ['prijzen'],
  },
  {
    vraag: 'Wat is een statische website eigenlijk?',
    antwoord:
      'Een site die als kant en klare bestanden klaarstaat in plaats van bij elk bezoek opnieuw opgebouwd te worden. Het verschil merk je aan drie dingen. Ze laadt in minder dan een seconde in plaats van in drie tot vijf. Ze kan niet gehackt worden via plugins, want er zijn er geen. En ze heeft geen maandelijks onderhoud nodig. Voor een site die je diensten toont en waar mensen je contactgegevens zoeken is dit gewoon de betere technische keuze. WordPress heeft zijn plaats, maar niet voor vier pagina\'s.',
    toon: ['home'],
  },
  {
    vraag: 'Ben ik eigenaar van mijn website?',
    antwoord:
      'Ja, volledig. De domeinnaam staat op jouw naam en jouw kaart, niet op de mijne. De bestanden van je site krijg je mee. Je zit nergens aan vast en je kan op elk moment met iemand anders verder. Ik vind het belangrijk dat je blijft omdat je tevreden bent, niet omdat je vastzit aan een contract of aan een domeinnaam die op mijn naam staat.',
    toon: ['prijzen'],
  },
  {
    vraag: 'Kom je aan huis?',
    antwoord:
      'Als het in de buurt is, graag. Ik werk vanuit Tessenderlo en kom gerust langs in Limburg om te bespreken wat je nodig hebt. Zit je verder, dan doen we het per telefoon en mail, dat werkt even goed. Bellen mag altijd. Je krijgt mij aan de lijn, geen callcenter en geen accountmanager.',
    toon: ['home'],
  },
];

export const faqVoor = (pagina: 'home' | 'prijzen') =>
  faq.filter((item) => item.toon.includes(pagina));
