// Turns a paragraph that contains only an image into a <figure>.
// If the image has a title — ![alt](src "caption") — it becomes the caption.
import { visit } from 'unist-util-visit';

export default function rehypeFigure() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (kids.length !== 1 || kids[0].type !== 'element' || kids[0].tagName !== 'img') return;
      const img = kids[0];
      img.properties.loading = 'lazy';
      const caption = img.properties.title;
      const children = [img];
      if (caption) {
        delete img.properties.title;
        children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: String(caption) }] });
      }
      parent.children[index] = { type: 'element', tagName: 'figure', properties: {}, children };
    });
  };
}
