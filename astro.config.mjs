// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeFigure from './src/lib/rehype-figure.mjs';
import rehypeAnchors from './src/lib/rehype-anchors.mjs';

export default defineConfig({
  site: 'https://theelandor.github.io',
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeFigure, rehypeAnchors],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: false,
    },
  },
  // Old Hugo URLs keep working.
  redirects: {
    '/gestione': '/notes/gestione/',
    '/compilatori': '/notes/compilatori/',
    '/ml': '/notes/ml/',
    '/reti': '/notes/reti/',
    '/security': '/notes/security/',
    '/content': '/notes/',
    '/page/1': '/posts/',
    '/page/2': '/posts/',
    '/posts/page/1': '/posts/',
    '/posts/page/2': '/posts/',
  },
});
