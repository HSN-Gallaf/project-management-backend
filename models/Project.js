const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    minLength: 30,
    maxLength: 350,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "web development",
      "mobile development",
      "desktop development",
      "other",
    ],
  },
  status: {
    type: String,
    enum: ["pending", "started", "finished", "cancelled"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  startDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
