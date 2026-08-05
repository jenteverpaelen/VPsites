/**
 * Het contactformulier. Draait op POST /api/contact.
 *
 * Dit stond eerst als Cloudflare Pages Function in functions/api/contact.ts.
 * Dat werkt alleen bij Pages, en dit project staat op Workers, dus de logica is
 * verhuisd naar een gewone fetch-handler. Inhoudelijk is er niets veranderd.
 *
 * Draait niet mee in `astro dev`. Het formulier vangt dat af en toont dan
 * een duidelijke melding in plaats van stilletjes te falen.
 *
 * Drie lagen tegen spam, van goedkoop naar duur:
 *   1. honeypot, een veld dat een mens nooit invult
 *   2. tijdcontrole, want een bot vult sneller in dan een mens kan typen
 *   3. Cloudflare Turnstile, alleen als de sleutel ingesteld is
 */

import type { Env } from './env';

type Antwoord = { ok: true } | { ok: false; fout: string };

const json = (data: Antwoord, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/** Minimale tijd tussen laden en versturen. Een mens haalt dit altijd. */
const MINIMUM_SECONDEN = 3;

export async function contact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, fout: 'Alleen POST.' }, 405);
  }

  let velden: FormData;
  try {
    velden = await request.formData();
  } catch {
    return json({ ok: false, fout: 'Ongeldige aanvraag.' }, 400);
  }

  const tekst = (naam: string) => String(velden.get(naam) ?? '').trim();

  // 1. Honeypot. Ingevuld betekent bot. We doen alsof het gelukt is,
  //    want een bot die een foutmelding krijgt, probeert opnieuw.
  if (tekst('bedrijfsnaam')) return json({ ok: true });

  // 2. Tijdcontrole.
  const geladen = Number(velden.get('geladen'));
  if (Number.isFinite(geladen) && (Date.now() - geladen) / 1000 < MINIMUM_SECONDEN) {
    return json({ ok: true });
  }

  const naam = tekst('naam');
  const email = tekst('email');
  const telefoon = tekst('telefoon');
  const bericht = tekst('bericht');
  const pakket = tekst('pakket');

  if (naam.length < 2) return json({ ok: false, fout: 'Vul je naam in.' }, 422);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return json({ ok: false, fout: 'Dat e-mailadres lijkt niet te kloppen.' }, 422);
  }
  if (bericht.length < 5) {
    return json({ ok: false, fout: 'Schrijf even kort wat je doet.' }, 422);
  }
  if (bericht.length > 5000) {
    return json({ ok: false, fout: 'Dat bericht is te lang.' }, 422);
  }

  // 3. Turnstile, alleen als er een sleutel is ingesteld.
  if (env.TURNSTILE_SECRET) {
    const token = tekst('cf-turnstile-response');
    if (!token) return json({ ok: false, fout: 'Bevestig even dat je geen robot bent.' }, 422);

    const controle = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('cf-connecting-ip') ?? undefined,
      }),
    })
      .then((r) => r.json() as Promise<{ success: boolean }>)
      .catch(() => ({ success: false }));

    if (!controle.success) {
      return json({ ok: false, fout: 'De controle is niet gelukt. Probeer opnieuw.' }, 422);
    }
  }

  // Zonder API-sleutel valt alles terug op loggen. De bezoeker krijgt dan
  // te zien dat hij beter rechtstreeks mailt, in plaats van te denken dat
  // zijn bericht verstuurd is.
  if (!env.RESEND_API_KEY) {
    console.log('[contact] geen RESEND_API_KEY ingesteld', { naam, email, telefoon, pakket });
    return json(
      { ok: false, fout: 'Het formulier is nog niet ingesteld. Mail me gerust rechtstreeks.' },
      503
    );
  }

  const inhoud = [
    `Naam: ${naam}`,
    `E-mail: ${email}`,
    telefoon ? `Telefoon: ${telefoon}` : null,
    pakket ? `Interesse in: ${pakket}` : null,
    '',
    bericht,
  ]
    .filter((regel) => regel !== null)
    .join('\n');

  const verstuurd = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_VAN ?? 'VPsites <formulier@vpsites.be>',
      to: [env.MAIL_NAAR ?? 'hallo@vpsites.be'],
      reply_to: email,
      subject: `Nieuwe aanvraag van ${naam}`,
      text: inhoud,
    }),
  }).catch(() => null);

  if (!verstuurd?.ok) {
    console.error('[contact] versturen mislukt', verstuurd?.status);
    return json(
      { ok: false, fout: 'Het versturen lukte niet. Probeer opnieuw of bel me even.' },
      502
    );
  }

  return json({ ok: true });
}
