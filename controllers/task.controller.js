const Project = require("../models/Project");
const Task = require("../models/Task");

// See if createOneTask, getAllTasks, getAllMyTasks should be moved to project controller?
const createOneTask = async (req, res) => {
  try {
    const foundProject = await Project.findById(req.params.projectId);

    if (!foundProject)
      return res.status(404).json({ message: "Project not found" });

    const isMember = foundProject.members.some((memberId) =>
      memberId.equals(req.user._id),
    );

    if (!isMember)
      return res.status(409).json({
        message: "You are not authorized to add a task to this project",
      });

    const {
      name,
      description,
      startDate,
      dueDate,
      priority,
      status,
      //   assignedTo,
    } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });

    // another idea for assignedTo is by selection(user might select himself or assigne it to another user)
    const createdTask = await Task.create({
      name: name,
      description: description,
      startDate: startDate,
      dueDate: dueDate,
      priority: priority,
      status: status,
      assignedTo: req.user._id,
      project: req.params.projectId,
    });

    res.status(201).json(createdTask);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const foundProject = await Project.findById(req.params.projectId);

    if (!foundProject)
      return res.status(404).json({ message: "Project not found" });

    const isMember = foundProject.members.some((memberId) =>
      memberId.equals(req.user._id),
    );

    if (!isMember)
      return res.status(409).json({
        message: "You are not authorized to add a task to this project",
      });

    const foundTasks = await Task.find({ project: req.params.projectId });

    res.status(200).json(foundTasks);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOneTask = async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.taskId);

    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(foundTask);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllMyTasks = async (req, res) => {
  try {
    const allMyTasks = await Task.find({
      assignedTo: { $in: [req.user._id] },
      project: req.params.projectId,
    });
    res.status(200).json(allMyTasks);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateOneTask = async (req, res) => {
  try {
    const foundTask = await Task.findByIdAndUpdate(req.params.taskId);

    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    if (!foundTask.assignedTo.equals(req.user._id))
      return res
        .status(409)
        .json({ message: "You are not authorize to update this task" });

    const {
      name,
      description,
      startDate,
      dueDate,
      priority,
      status,
      // assignedTo,
    } = req.body;

    // another idea for assignedTo is by selection(user might select himself or assigne it to another user)
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, {
      name: name,
      description: description,
      startDate: startDate,
      dueDate: dueDate,
      priority: priority,
      status: status,
      //   assignedTo: assignedTo,
    });

    res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteOneTask = async (req, res) => {
  try {
    const foundTask = await Task.findByIdAndUpdate(req.params.taskId);

    if (!foundTask) return res.status(404).json({ message: "Task not found" });

    if (!foundTask.assignedTo.equals(req.user._id))
      return res
        .status(409)
        .json({ message: "You are not authorize to delete this task" });

    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

    res.sendStatus(204);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOneTask,
  getAllTasks,
  getOneTask,
  getAllMyTasks,
  updateOneTask,
  deleteOneTask,
};
