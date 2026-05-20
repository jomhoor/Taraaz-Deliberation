// Stub for sanitize-html — browser-compatible replacement using native DOM APIs.
// sanitize-html depends on htmlparser2 which uses Node.js stream APIs, breaking Vite browser builds.
// This stub replicates the subset of the API used in html.ts via DOMParser.

/**
 * @param {string} html
 * @param {{ allowedTags?: string[], allowedAttributes?: Record<string, string[]> }} [options]
 * @returns {string}
 */
function sanitizeHtml(html, options) {
  if (!html) return html;
  const allowedTags =
    options && options.allowedTags != null ? options.allowedTags : null;
  const allowedAttributes = (options && options.allowedAttributes) || {};

  const doc = new DOMParser().parseFromString(html, "text/html");

  function processNode(node) {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType !== 1) continue; // skip text nodes and comments
      const tag = child.tagName.toLowerCase();
      if (allowedTags !== null && !allowedTags.includes(tag)) {
        // Disallowed tag: recurse into children first, then unwrap the element
        processNode(child);
        const frag = document.createDocumentFragment();
        while (child.firstChild) frag.appendChild(child.firstChild);
        node.replaceChild(frag, child);
      } else {
        // Allowed tag: strip disallowed attributes, then recurse
        const allowed =
          allowedAttributes[tag] || allowedAttributes["*"] || [];
        Array.from(child.attributes).forEach((attr) => {
          if (!allowed.includes(attr.name)) child.removeAttribute(attr.name);
        });
        processNode(child);
      }
    }
  }

  processNode(doc.body);
  return doc.body.innerHTML;
}

sanitizeHtml.defaults = { allowedTags: [], allowedAttributes: {} };
export default sanitizeHtml;
