import express from "express";
import {
  generateDocumentEmbeddings
} from "../controllers/embeddingController.js";

const router = express.Router();

router.post("/generate", generateDocumentEmbeddings);

export default router;