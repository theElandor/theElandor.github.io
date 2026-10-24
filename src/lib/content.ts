import { existsSync } from 'node:fs';
import { getCollection } from 'astro:content';
import { asdTopics } from './asd-topics';

/** Published posts, newest first. `listed` excludes posts marked `hidden`. */
export async function getPosts({ listed = true } = {}) {
  const posts = await getCollection('posts', ({ data }) => !data.draft && (!listed || !data.hidden));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** URL-friendly id for a topic name ("Sorting & searching" -> "sorting-and-searching"). */
export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * Handwritten ASD notes, in course order, plus the same notes grouped by topic.
 * Each note gets a `thumb`: the copy in a "thumbs" folder next to its image, or the image itself.
 */
export async function getAsdNotes() {
  const entries = await getCollection('asdNotes');
  const all = entries.map(({ data }) => {
    const thumb = data.image.replace(/\/([^/]+)$/, '/thumbs/$1');
    return { ...data, thumb: existsSync(`public${thumb}`) ? thumb : data.image };
  });
  const topics = asdTopics
    .map((name) => ({ name, slug: slugify(name), notes: all.filter((n) => n.topic === name) }))
    .filter((t) => t.notes.length > 0);
  return { notes: topics.flatMap((t) => t.notes), topics };
}
