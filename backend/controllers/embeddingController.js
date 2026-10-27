import DocumentChunk from "../models/DocumentChunk.js";
import generateEmbedding from "../services/embeddingService.js";

export const generateDocumentEmbeddings = async (req, res) => {
  try {
    // Find chunks where embeddings are missing or empty
    const chunks = await DocumentChunk.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } }
      ]
    });

    console.log("Chunks found:", chunks.length);

    if (chunks.length === 0) {
      return res.status(200).json({
        message: "All chunks already have embeddings",
        processed: 0
      });
    }

    let processed = 0;

    for (const chunk of chunks) {
      // Generate embedding
      const embedding = await generateEmbedding(chunk.content);

      // Save embedding in MongoDB
      chunk.embedding = embedding;
      await chunk.save();

      processed++;
    }

    return res.status(200).json({
      message: "Embeddings generated successfully",
      processed
    });

  } catch (error) {
    console.error("Embedding generation error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};