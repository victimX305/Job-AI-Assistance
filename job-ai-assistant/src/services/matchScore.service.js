exports.calculateMatchScore = (jobKeywords, cvKeywords) => {
  const matched = jobKeywords.filter(word => cvKeywords.includes(word));
  const missing = jobKeywords.filter(word => !cvKeywords.includes(word));

  const score = Math.round((matched.length / jobKeywords.length) * 100);

  return {
    score,
    matched_keywords: matched,
    missing_keywords: missing
  };
};