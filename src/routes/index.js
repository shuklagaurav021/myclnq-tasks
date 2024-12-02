const tasksRoutes = require("./tasks.routes");
module.exports = (app) => {
  app.use("/tasks", tasksRoutes);

};
