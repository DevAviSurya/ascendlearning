import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each entry is a Certificate Program (e.g. "Certificate in Business
// Analysis"). Every program is made up of exactly three courses, each with
// its own course code, duration, description, and learning outcomes.
const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    description: z.string(),
    totalHours: z.string(),
    deliveryMethod: z.string(),
    level: z.enum(['Foundation', 'Intermediate', 'Advanced', 'All Levels']),
    order: z.number(),
    featured: z.boolean().default(false),
    audience: z.array(z.string()),
    outcomes: z.array(z.string()),
    modules: z
      .array(
        z.object({
          code: z.string(),
          title: z.string(),
          duration: z.string(),
          description: z.string(),
          outcomes: z.array(z.string()),
        }),
      )
      .length(3),
  }),
});

export const collections = { courses };
