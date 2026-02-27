const Task = require("../models/taskModel");

// CREATE TASK
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL TASKS
const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};



// UPDATE TASK
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// DELETE TASK
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask
};