import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// z uit astro:content is deprecated in Astro 7, astro/zod is de opvolger.
import { z } from 'astro/zod';

/**
 * Zod-schema's zodat een ontbrekend veld tijdens de build stukloopt
 * en niet stilletjes een lege pagina oplevert.
 */

const werk = defineCollection({
  // Bestanden met een underscore vooraan worden overgeslagen. Zo kan
  // _sjabloon.md als voorbeeld blijven staan zonder op de site te komen.
  loader: glob({ base: './src/content/werk', pattern: '**/[!_]*.md' }),
  schema: z.object({
    titel: z.string(),
    /** in-aanbouw toont een badge, live linkt door, concept is een demo. */
    status: z.enum(['in-aanbouw', 'live', 'concept']),
    branche: z.string(),
    gemeente: z.string().optional(),
    jaar: z.number(),
    samenvatting: z.string(),
    pakket: z.string().optional(),
    /** Alleen invullen als de site effectief online staat. */
    url: z.url().optional(),
    volgorde: z.number().default(50),
    uitgelicht: z.boolean().default(false),
  }),
});

const kennis = defineCollection({
  loader: glob({ base: './src/content/kennis', pattern: '**/*.md' }),
  schema: z.object({
    titel: z.string(),
    /**
     * Alleen invullen als `titel` te lang is voor de zoekresultaten.
     * Samen met " | VPsites" moet dit onder 60 tekens blijven.
     */
    seoTitel: z.string().max(48).optional(),
    /** Onder 155 tekens. Wordt de meta description. */
    beschrijving: z.string().max(160),
    /** Korte kop voor in overzichten. */
    kop: z.string(),
    gepubliceerd: z.coerce.date(),
    gewijzigd: z.coerce.date().optional(),
    leestijd: z.number(),
    volgorde: z.number().default(50),
  }),
});

export const collections = { werk, kennis };
