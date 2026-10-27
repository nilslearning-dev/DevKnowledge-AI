import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    originalName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },
     extractedText: {
      type: String,
      default: ""
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    tags: {
      type: [String],
      default: []
    },
  },
  {
    timestamps: true
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;