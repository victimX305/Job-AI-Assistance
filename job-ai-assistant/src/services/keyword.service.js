const STOPWORDS = ["the", "and", "with", "for", "you", "are", "this", "that"];

exports.extractKeywords = (text) => {
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/);

  const freq = {};

  words.forEach(word => {
    if (word.length > 3 && !STOPWORDS.includes(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 20);
};