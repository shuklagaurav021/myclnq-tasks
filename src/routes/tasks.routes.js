const express = require("express");
const router = express.Router();
const taskService = require("../service/tasks");

router.post("/", async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tasks = await taskService.fetchTasks(parseInt(page), parseInt(limit));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/status/:status", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { status } = req.params;
    const validStatuses = ["pending", "completed"];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res
        .status(400)
        .json({ error: "Invalid status. Use 'pending' or 'completed'." });
    }

    const tasks = await taskService.fetchTasksByStatus(
      status,
      parseInt(page),
      parseInt(limit)
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await taskService.updateTaskStatus(
      req.params.id,
      req.body.status
    );
    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await taskService.removeTask(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
