import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import { handleGemniniApiError } from "./geminiService.js";

let ai;
export const generateEmbedding = async (contents) => {
  try {
    if (!ai) {
       if (!process.env.GEMINI_API_KEY || !process.env.EMBEDDING_MODEL) {
            throw new Error("Gemini api key or embedding model name is missing in .env");
        }
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_EMBEDDING_API_KEY,
      });
    }

    return await ai.models.embedContent({
      model: process.env.EMBEDDING_MODEL,
      contents,
      config: {
        outputDimensionality: 768,
      },
    });
  } catch (error) {
    throw handleGemniniApiError(error, "Failed to generate embedding.")
  }
}

// Split text into chunks
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

  try {
    const docs = await splitter.createDocuments([text]);
    const texts = docs.map((doc) => doc.pageContent.trim());

    const response = await generateEmbedding(texts);

    const embeddings = response.embeddings;

    return docs.map((doc, index) => ({
      content: doc.pageContent.trim(),
      embedding: embeddings[index].values
    }));
  } catch (error) {
    throw error;
  }
};
