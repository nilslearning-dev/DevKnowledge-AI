
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography
} from "@mui/material";

import { askAI } from "../services/aiService";

const AIChat = ({ projectId }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAskAI = async () => {
    if (!question.trim() || !projectId) return;

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setSources([]);

      const data = await askAI(question, projectId);

      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        DevKnowledge AI Assistant
      </Typography>

      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Ask your project question"
        placeholder="Example: How does payment work?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAskAI}
        disabled={loading || !question.trim() || !projectId}
      >
        {loading ? "Generating..." : "Ask AI"}
      </Button>

      {loading && (
        <Box sx={{ mt: 3 }}>
          <CircularProgress size={25} />
          <Typography>Searching documents and generating answer...</Typography>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {answer && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              AI Answer
            </Typography>

            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {answer}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">
              Source Documents
            </Typography>

            {sources.map((source, index) => (
              <Box key={source.documentId || index} sx={{ mt: 2 }}>
                <Typography fontWeight="bold">
                  {source.documentName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Similarity: {source.similarity.toFixed(3)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: 1, whiteSpace: "pre-wrap" }}
                >
                  {source.content}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIChat;
