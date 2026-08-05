/**
 * Het entrypoint van de Worker. Doet twee dingen en niets meer.
 *
 * De site zelf is statisch en zit in dist/. Cloudflare bedient die bestanden
 * rechtstreeks van de edge en roept deze Worker daar niet voor aan. Alleen een
 * verzoek dat op geen enkel bestand past, komt hier terecht.
 *
 * Vandaar de opzet: is het /api/contact, dan handelt het formulier het af. Al
 * het andere geven we door aan de assets-binding, die dan de 404-pagina van
 * Astro teruggeeft. Zo werkt het ook als Cloudflare ooit alles eerst naar de
 * Worker stuurt in plaats van naar de assets.
 */

import type { Env } from './env';
import { contact } from './contact';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact') {
      return contact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
