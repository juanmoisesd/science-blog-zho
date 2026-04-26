import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  author: z.string(),
  category: z.string(),
});

const psychology = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/psychology" }),
  schema: blogSchema,
});

const neuroscience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/neuroscience" }),
  schema: blogSchema,
});

export const collections = {
  'psychology': psychology,
  'neuroscience': neuroscience,
};
