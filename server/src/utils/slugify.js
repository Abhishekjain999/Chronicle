const slugifyLib = require('slugify');

/**
 * Generate a clean URL-friendly slug
 * @param {string} text
 * @returns {string}
 */
const createSlug = (text) => {
  return slugifyLib(text || '', {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

module.exports = { createSlug };
