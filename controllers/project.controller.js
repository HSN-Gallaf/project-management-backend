const Project = require("../models/Project");

const createOneProject = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body;

    if (!name || !category)
      return res
        .status(400)
        .json({ message: "name and category are required" });

    const createdProject = await Project.create({
      name: name,
      description: description,
      category: category,
      status: status,
      priority: priority,
      startDate: startDate,
      dueDate: dueDate,
      owner: req.user._id,
    });

    const updatedProject = await Project.findByIdAndUpdate(
      createdProject._id,
      {
        $push: { members: req.user._id },
      },
      { returnDocument: "after" },
    );

    res.status(201).json(updatedProject);
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

const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find();

    res.status(200).json(allProjects);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getOneProject = async (req, res) => {
  try {
    const foundProject = await Project.findById(req.params.projectId);

    if (!foundProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(foundProject);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getAllMyProjects = async (req, res) => {
  try {
    const allMyProjects = await Project.find({
      members: { $in: [req.user._id] },
    });
    res.status(200).json(allMyProjects);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const updateOneProject = async (req, res) => {
  try {
    const foundProject = await Project.findById(req.params.projectId);

    if (!foundProject)
      return res.status(404).json({ message: "Project not found" });

    // Mybe here it should be if user role is admin he can update
    if (!foundProject.owner.equals(req.user._id))
      return res
        .status(409)
        .json({ message: "You are not authorized to update this project" });

    const {
      name,
      description,
      category,
      status,
      priority,
      startDate,
      dueDate,
    } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        name: name,
        description: description,
        category: category,
        status: status,
        priority: priority,
        startDate: startDate,
        dueDate: dueDate,
        owner: req.user._id,
      },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json(updatedProject);
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

const updateMembers = async (req, res) => {
  try {
    const foundProject = await Project.findById(req.params.projectId);

    if (!foundProject)
      return res.status(404).json({ message: "Project not found" });

    if (!foundProject.owner.equals(req.user._id))
      return res.status(409).json({
        message: "You are not authorized to add members to this project",
      });

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        members: req.body,
      },
      { returnDocument: "after" },
    );

    res.status(200).json(updatedProject);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createOneProject,
  getAllProjects,
  getOneProject,
  getAllMyProjects,
  updateOneProject,
  updateMembers,
};
