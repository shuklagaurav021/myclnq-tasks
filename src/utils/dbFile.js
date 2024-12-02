const fs = require("fs");
const path = require("path");
require("dotenv").config();

const dataFilePath = path.join(__dirname, "..", process.env.DATA_FILE);

if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

const loadTasks = () => {
  const data = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
};

module.exports = { loadTasks, saveTasks };
