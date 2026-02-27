const express = require("express");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskcontroller");

const taskrouter = express.Router();

taskrouter.post("/create", createTask);      
taskrouter.get("/alltask", getAllTasks);                          
taskrouter.put("/update/:id", updateTask);             
taskrouter.delete("/delete/:id", deleteTask);          

module.exports = taskrouter;