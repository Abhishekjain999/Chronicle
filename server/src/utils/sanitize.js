const xss = require('xss');

// Custom options for XSS filter allowing standard editorial tags
const options = {
  whiteList: {
    ...xss.whiteList,
    h1: ['id', 'class'],
    h2: ['id', 'class'],
    h3: ['id', 'class'],
    h4: ['id', 'class'],
    h5: ['id', 'class'],
    h6: ['id', 'class'],
    p: ['class'],
    span: ['class'],
    pre: ['class'],
    code: ['class'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    blockquote: ['class'],
    table: ['class'],
    thead: [],
    tbody: [],
    tr: [],
    th: ['align'],
    td: ['align'],
    del: [],
    hr: [],
    a: ['href', 'title', 'target', 'rel'],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object'],
};

const customFilter = new xss.FilterXSS(options);

const sanitizeContent = (dirty) => {
  if (!dirty || typeof dirty !== 'string') return '';
  return customFilter.process(dirty);
};

module.exports = { sanitizeContent };
