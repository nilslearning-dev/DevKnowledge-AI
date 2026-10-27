import express from "express";
import { searchRelevantChunks } from "../controllers/retrievalController.js";

const router = express.Router();

router.post("/search", searchRelevantChunks);

export default router;