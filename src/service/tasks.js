const { loadTasks, saveTasks } = require("../utils/dbFile");
const pool = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { paginate } = require("../utils/pagination");

let tasks = loadTasks();

const saveTasksToFile = () => {
  saveTasks(tasks);
};

const createTask = async (data) => {
  const { title, description } = data;

  const result = await pool.query(
    "INSERT INTO tasks (id, title, description, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
    [uuidv4(), title, description]
  );
  
  // Also save to in-memory array and file
  const newTask = result.rows[0];
  tasks.push(newTask);
  saveTasksToFile();

  return newTask;
};

const fetchTasks = (page = 1, limit = 10) => {
  return paginate(tasks, page, limit);
};

const fetchTasksByStatus = (status, page = 1, limit = 10) => {
  const filteredTasks = tasks.filter((task) => task.status === status);
  return paginate(filteredTasks, page, limit);
};

const updateTaskStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  
  if (result.rows.length === 0) throw new Error("Task not found");

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) throw new Error("Task not found");
  tasks[taskIndex].status = status;

  saveTasksToFile();
  return tasks[taskIndex];
};

const removeTask = async (id) => {
  const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
  if (result.rows.length === 0) throw new Error("Task not found");

  tasks = tasks.filter((task) => task.id !== id);
  saveTasksToFile();
};

module.exports = { createTask, fetchTasks, fetchTasksByStatus, updateTaskStatus, removeTask };
