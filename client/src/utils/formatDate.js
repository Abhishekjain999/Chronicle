/**
 * Format date string into human-readable format (e.g., "Oct 28, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format relative time (e.g. "3 hours ago", "yesterday")
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  return formatDate(dateString);
};

/**
 * Estimate reading time in minutes
 */
export const estimateReadingTime = (content) => {
  if (!content) return 1;
  const wordCount = content.replace(/<[^>]*>?/gm, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};
