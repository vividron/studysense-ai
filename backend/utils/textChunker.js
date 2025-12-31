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
  if (!chunks || chunks.length === 0 || !query?.trim()) {
    return [];
  }

  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
    'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return [];
  }

  return chunks
    .map(chunk => {
      const content = chunk.content.toLowerCase();
      let score = 0;

      for (const word of queryWords) {
        const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matches = content.match(new RegExp(`\\b${escapedWord}\\b`, "g")) || [];
        score += matches.length * 3;
      }

      return {
        ...chunk,
        score: score / Math.sqrt(content.split(/\s+/).length)
      };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
};
