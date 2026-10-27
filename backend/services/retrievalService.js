import DocumentChunk from "../models/DocumentChunk.js";
import generateEmbedding from "./embeddingService.js";
import cosineSimilarity from "./similarityService.js";

const retrieveRelevantChunks = async (question, projectId) => {
  // 1. Convert user question into an embedding
  const questionEmbedding = await generateEmbedding(question);

  // 2. Fetch chunks having valid embeddings
  const chunks = await DocumentChunk.find({
    project: projectId,
    embedding: { $exists: true, $ne: [] }
  }).lean();

  // 3. Calculate similarity for every chunk
  const results = chunks.map((chunk) => ({
    ...chunk,
    similarity: cosineSimilarity(
      questionEmbedding,
      chunk.embedding
    )
  }));

  // 4. Sort highest similarity first
  results.sort((a, b) => b.similarity - a.similarity);

  // 5. Return top 3 relevant chunks
  return results.slice(0, 3);
};

export default retrieveRelevantChunks;