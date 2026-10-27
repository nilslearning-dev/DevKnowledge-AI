
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    technology: {
      type: String,
      default: "MERN"
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "On Hold"],
      default: "Active"
    },

    manager: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
