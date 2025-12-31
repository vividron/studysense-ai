import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Split text into chunks for AI processing
export const chunkText = async (
  text,
  chunkSize = 500,
  overlap = 50
) => {
  if (!text || !text.trim()) return [];

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunkSize * 5,   // approx chars per word
    chunkOverlap: overlap * 5,
    separators: ["\n\n", "\n", " ", ""]
  });

  const docs = await splitter.createDocuments([text]);

  return docs.map((doc, index) => ({
    content: doc.pageContent.trim(),
    chunkIndex: index
  }));
};


// Find relevant chunks based on keyword matching
export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
  if (!Array.isArray(chunks) || chunks.length === 0 || !query) {
    return [];
  }

  // Common stop words
  const stopWords = new Set([
    "the", "is", "at", "which", "on", "a", "an", "and", "or", "but",
    "in", "with", "to", "for", "of", "as", "by", "this", "that", "it"
  ]);

  // Extract and clean query words
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // If no meaningful keywords, return first chunks
  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks).map(chunk => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
    }));
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const content = chunk.content.toLowerCase();
    const contentWordCount = content.split(/\s+/).length;

    let score = 0;

    // Score each query word
    for (const word of queryWords) {
      // Exact word matches
      const exactRegex = new RegExp(`\\b${word}\\b`, "gi");
      const exactMatches = (content.match(exactRegex) || []).length;
      score += exactMatches * 3;

      // Partial matches
      const partialRegex = new RegExp(word, "gi");
      const partialMatches = (content.match(partialRegex) || []).length;
      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    // Bonus for matching multiple query words
    const matchedWords = queryWords.filter(word => content.includes(word)).length;
    if (matchedWords > 1) {
      score += matchedWords * 2;
    }

    // Normalize score by content length
    const normalizedScore = score / Math.sqrt(contentWordCount || 1);

    // Small bonus for earlier chunks
    const positionBonus = 1 - (index / chunks.length) * 0.1;

    return {
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      score: normalizedScore * positionBonus,
      rawScore: score,
      matchedWords
    };
  });

  return scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedWords !== a.matchedWords) return b.matchedWords - a.matchedWords;
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
