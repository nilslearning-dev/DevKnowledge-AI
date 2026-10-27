
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import documentRoutes from "./routes/documentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import embeddingRoutes from "./routes/embeddingRoutes.js";
import retrievalRoutes from "./routes/retrievalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use("/api/documents", documentRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/embeddings", embeddingRoutes);
app.use("/api/retrieval", retrievalRoutes);
app.use("/api/ai", aiRoutes);


// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevKnowledge AI backend is running"
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
