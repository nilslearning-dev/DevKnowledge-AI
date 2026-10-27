
const chunkText = (text, chunkSize = 500, overlap = 50) => {
  // Remove unnecessary extra spaces
  const words = text.split(/\s+/).filter(Boolean);

  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words.slice(start, end).join(" ");

    chunks.push(chunk);

    // Move forward while keeping some words from previous chunk
    start += chunkSize - overlap;
  }

  return chunks;
};

export default chunkText;
