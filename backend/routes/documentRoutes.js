import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import Document from "../models/Document.js";
import Project from "../models/Project.js";
import extractPdfText from "../utils/pdfExtractor.js";
import chunkText from "../utils/textChunker.js";
import DocumentChunk from "../models/DocumentChunk.js";
import generateEmbedding from "../services/embeddingService.js";

const router = express.Router();

// 1. Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  }
});

// 2. Allow only PDF, TXT and MD files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".txt", ".md"];

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, TXT and MD files are allowed"));
  }
};

// 3. Configure Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// 4. Upload document API
router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { projectId, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document"
      });
    }

    if (!projectId) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        message: "Project ID is required"
      });
    }

    // Check whether project exists
    const project = await Project.findById(projectId);

    if (!project) {
      fs.unlinkSync(req.file.path);

      return res.status(404).json({
        message: "Project not found"
      });
    }

    let extractedText = "";

if (req.file.mimetype === "application/pdf") {
  extractedText = await extractPdfText(req.file.path);
}
// Split extracted text into chunks
const chunks = chunkText(extractedText, 500, 50);

    // Save document information in MongoDB
    const document = await Document.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      fileSize: req.file.size,
      project: projectId,
      tags: tags ? JSON.parse(tags) : [],
      extractedText
    });

// Generate embeddings for every chunk
const chunkDocuments = [];

for (let index = 0; index < chunks.length; index++) {
  const content = chunks[index];

  // Generate 384-dimensional embedding
  const embedding = await generateEmbedding(content);

  chunkDocuments.push({
    document: document._id,
    project: projectId,
    chunkIndex: index,
    content,
    embedding
  });
}

// Save chunks with embeddings in MongoDB
if (chunkDocuments.length > 0) {
  await DocumentChunk.insertMany(chunkDocuments);
}

    res.status(201).json({
      message: "Document uploaded successfully",
      document
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: error.message
    });
  }
});

// GET: Get documents by Project ID
router.get("/project/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const documents = await Document.find({
      project: projectId
    }).populate("project", "name");

    res.status(200).json({
      message: "Documents fetched successfully",
      documents
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;