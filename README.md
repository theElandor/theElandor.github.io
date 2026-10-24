# theelandor.github.io

Personal website of Matteo Lugli, built with [Astro](https://astro.build).
Content is plain Markdown and YAML, so you can edit it without writing code.

## Editing the site (no code)

### Option A: Pages CMS (a visual editor in the browser)

1. Go to <https://app.pagescms.org> and sign in with GitHub.
2. Pick the `theElandor/theElandor.github.io` repository.
3. You'll see **Blog posts**, **Projects**, **Publications**, **Teaching slides**, **Handwritten notes**, **YouTube videos**, **Pages**, **Site settings** and **University notes**.
   Edit, click **Save**: that's a commit, and the site redeploys by itself in about a minute.

Images you upload go to `public/media/` and are served at `/media/...`.

> Tip: for posts that contain math (`$x^2$`), switch the editor to **Source** mode, so the formulas are saved exactly as written.

### Option B: GitHub's web editor

Open a file on github.com and click the pencil icon. Commit, and the site redeploys.

## Where things live

| What | File(s) |
| --- | --- |
| Blog posts | `src/content/posts/*.md` (one file per post) |
| About, Challenge, HTB pages | `src/content/pages/*.md` |
| University notes (archive) | `src/content/notes/*.md` |
| Projects | `src/data/projects.yaml` |
| Publications | `src/data/publications.yaml` |
| Teaching slides | `src/data/slides.yaml` |
| YouTube videos (Teaching page) | `src/data/videos.yaml` |
| Handwritten ASD notes (Teaching page) | `src/data/asd-notes.yaml`, photos in `public/media/asd-2026/` |
| Name, tagline, links | `src/data/site.yaml` |
| Static files (PDFs, slides, old notes, challenge) | `public/` (served as-is, same URLs as before) |

### Writing a new post

Create `src/content/posts/my-post.md`. It will be published at `/posts/my-post/`.

```markdown
---
title: "My new post"
description: "A one-line subtitle"
date: 2026-10-17
tags: ["algorithms"]
---

Write **Markdown** here. Math works: $e^{i\pi} + 1 = 0$, or a block:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

![A caption for the image](/media/picture.png "A caption for the image")
```

Optional flags: `hidden: true` publishes the post without listing it; `draft: true` doesn't publish it.

## Running locally (optional)

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Deployment

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages on every push to `master`.
In the repository settings, **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**.
