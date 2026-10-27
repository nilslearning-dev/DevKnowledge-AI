
import retrieveRelevantChunks from "../services/retrievalService.js";
import generateAnswer from "../services/llmService.js";
import Document from "../models/Document.js";

export const askAI = async (req, res) => {
  try {
    const { question, projectId } = req.body;

    if (!question || !projectId) {
      return res.status(400).json({
        message: "Question and projectId are required"
      });
    }

    // Step 1: Find relevant document chunks in MongoDB
    const relevantChunks = await retrieveRelevantChunks(
      question,
      projectId
    );

    if (relevantChunks.length === 0) {
      return res.status(200).json({
        answer: "I couldn't find relevant information in this project's documents."
      });
    }

    // Step 2: Combine retrieved chunks into context
    const context = relevantChunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    // Step 3: Send question and context to local Qwen model
    const answer = await generateAnswer(question, context);

   const sources = await Promise.all(
  relevantChunks.map(async (chunk) => {
    const document = await Document.findById(chunk.document)
      .select("originalName fileName")
      .lean();

    return {
      documentId: chunk.document,
      documentName: document?.originalName || document?.fileName || "Unknown document",
      content: chunk.content,
      similarity: chunk.similarity
    };
  })
);

return res.status(200).json({
  answer,
  sources
});

  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};
