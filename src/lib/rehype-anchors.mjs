// Gives headings stable ids and repairs in-page links written for Hugo's id scheme
// (e.g. "#htn--introduzione" -> "#htn-introduzione").
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';

const text = (node) =>
  node.type === 'text' ? node.value : (node.children || []).map(text).join('');
const loose = (s) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '');

export default function rehypeAnchors() {
  return (tree) => {
    const slugger = new Slugger();
    const ids = new Map();
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;
      if (typeof node.properties.id !== 'string') node.properties.id = slugger.slug(text(node));
      ids.set(loose(node.properties.id), node.properties.id);
    });
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties.href;
      if (typeof href !== 'string' || !href.startsWith('#') || href.length < 2) return;
      let target = href.slice(1);
      try { target = decodeURIComponent(target); } catch {}
      const match = ids.get(loose(target));
      if (match) node.properties.href = `#${match}`;
    });
  };
}
