
import express from "express";
import { askAI } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/ai/ask
router.post("/ask", askAI);

export default router;
