import retrieveRelevantChunks from "../services/retrievalService.js";

export const searchRelevantChunks = async (req, res) => {
  try {
    const { question, projectId } = req.body;

    if (!question || !projectId) {
      return res.status(400).json({
        message: "Question and projectId are required"
      });
    }

    const results = await retrieveRelevantChunks(
      question,
      projectId
    );

    return res.status(200).json({
      message: "Relevant chunks retrieved successfully",
      count: results.length,
      results: results.map((chunk) => ({
        content: chunk.content,
        similarity: chunk.similarity,
        document: chunk.document
      }))
    });

  } catch (error) {
    console.error("Retrieval error:", error);

    return res.status(500).json({
      message: error.message
    });
  }
};