const DOMPurify = require('isomorphic-dompurify');

// Strips all HTML/script content -- our app only ever stores plain text.
function sanitizeText(input, maxLength = 4000) {
  if (typeof input !== 'string') return '';
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  return clean.trim().slice(0, maxLength);
}

module.exports = { sanitizeText };
