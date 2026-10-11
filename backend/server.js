const cors = require("cors");
const express = require("express");
const connectDB = require("./db");
const Task = require("./models/Task");
const Note = require("./models/Note");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Dayora Backend!");
});

app.get("/api/health", (req, res) => {
  res.json({ message: "Dayora server is running!" });
});

// Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// Add a task

app.post("/api/tasks", async (req, res) => {
  try {
    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    if (!name) {
      return res.status(400).json({
        message: "Task name is required."
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Task name must be 100 characters or less."
      });
    }

    const task = await Task.create({ name });

    res.status(201).json(task);
  } catch (error) {
    console.error("Add task error:", error.message);

    res.status(500).json({
      message: "Unable to save task. Please try again."
    });
  }
});

// Complete or uncomplete a task
app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: "Failed to update task" });
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete task" });
  }
});


 // Get all study notes
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// Add a study note

app.post("/api/notes", async (req, res) => {
  try {
    const title =
      typeof req.body.title === "string"
        ? req.body.title.trim()
        : "";

    const content =
      typeof req.body.content === "string"
        ? req.body.content.trim()
        : "";

    if (!title || !content) {
      return res.status(400).json({
        message: "Note title and content are required."
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Note title must be 100 characters or less."
      });
    }

    if (content.length > 5000) {
      return res.status(400).json({
        message: "Note content must be 5000 characters or less."
      });
    }

    const note = await Note.create({ title, content });

    res.status(201).json(note);
  } catch (error) {
    console.error("Add note error:", error.message);

    res.status(500).json({
      message: "Unable to save note. Please try again."
    });
  }
});

// Delete a study note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete note" });
  }
});

app.listen(PORT, () => {
  console.log(`Dayora server running at http://localhost:${PORT}`);
});