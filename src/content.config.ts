import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { asdTopics } from './lib/asd-topics';

// Blog posts: one Markdown file per post in src/content/posts.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false), // not published at all
    hidden: z.boolean().default(false), // published, but not listed
  }),
});

// Old university notes (historical archive).
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    course: z.string(),
    year: z.string().optional(),
    order: z.number().default(99),
    // true keeps the notes in the repo but off the website.
    draft: z.boolean().default(false),
  }),
});

// Standalone pages (about, challenges, ...).
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

// YAML lists in src/data. Items get an id from their position.
const yamlList = (path: string) =>
  file(path, { parser: (text) => (parse(text) ?? []).map((item: object, i: number) => ({ id: String(i).padStart(3, '0'), ...item })) });

const projects = defineCollection({
  loader: yamlList('src/data/projects.yaml'),
  schema: z.object({
    name: z.string(),
    emoji: z.string().optional(),
    description: z.string().optional(),
    url: z.url(),
    category: z.enum(['Deep Learning', 'Puzzles', 'Educational', 'Contributions']),
    featured: z.boolean().default(false),
    report: z.string().optional(),
    post: z.string().optional(),
    image: z.string().optional(),
  }),
});

const publications = defineCollection({
  loader: yamlList('src/data/publications.yaml'),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    url: z.string().optional(),
    pdf: z.string().optional(),
    poster: z.string().optional(),
    code: z.string().optional(),
  }),
});

const slides = defineCollection({
  loader: yamlList('src/data/slides.yaml'),
  schema: z.object({
    title: z.string(),
    topic: z.string().optional(),
    description: z.string().optional(),
    url: z.string(),
  }),
});

const videos = defineCollection({
  loader: yamlList('src/data/videos.yaml'),
  schema: z.object({
    youtube: z.string(),
    title: z.string(),
    start: z.number().optional(),
  }),
});

// Handwritten notes from the Algorithms and Data Structures course (one photo per page).
const asdNotes = defineCollection({
  loader: yamlList('src/data/asd-notes.yaml'),
  schema: z.object({
    title: z.string(),
    topic: z.enum(asdTopics),
    image: z.string(),
    featured: z.boolean().default(false), // also shown in the carousel on /teaching/
  }),
});

export const collections = { posts, notes, pages, projects, publications, slides, videos, asdNotes };
