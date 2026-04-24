const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/taskdb")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const TaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model("Task", TaskSchema);

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.json(newTask);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Toggle complete
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
