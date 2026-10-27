
import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    chunkIndex: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    embedding: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

const DocumentChunk = mongoose.model(
  "DocumentChunk",
  documentChunkSchema
);

export default DocumentChunk;
