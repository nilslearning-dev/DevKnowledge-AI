
import { pipeline } from "@huggingface/transformers";

let embeddingPipeline = null;

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text cannot be empty");
  }

  // Load the model only once
  if (!embeddingPipeline) {
    console.log("Loading local embedding model...");

    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.log("Embedding model loaded!");
  }

  const output = await embeddingPipeline(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
};

export default generateEmbedding;
