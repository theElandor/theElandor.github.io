import { getCollection } from 'astro:content';

/** Published posts, newest first. `listed` excludes posts marked `hidden`. */
export async function getPosts({ listed = true } = {}) {
  const posts = await getCollection('posts', ({ data }) => !data.draft && (!listed || !data.hidden));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
