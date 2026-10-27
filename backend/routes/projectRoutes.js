
import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// GET: Fetch all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json({
      success: true,
      data: projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// POST: Create project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// PUT: Update project
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});


// DELETE: Delete project
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(
      req.params.id
    );

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
