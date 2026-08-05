/**
 * Minimale eigen typering in plaats van @cloudflare/workers-types. Dat pakket
 * weegt tientallen megabytes voor precies deze paar regels, en we gebruiken
 * maar twee dingen: de assets-binding en vier omgevingsvariabelen.
 *
 * De variabelen zijn allemaal optioneel. Zonder RESEND_API_KEY gaat de site
 * gewoon online en krijgt de bezoeker bij het formulier een nette melding.
 */

export type Env = {
  /** De statische build in dist/, aangehangen via wrangler.jsonc. */
  ASSETS: { fetch(request: Request): Promise<Response> };

  RESEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  MAIL_NAAR?: string;
  MAIL_VAN?: string;
};
