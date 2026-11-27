const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const taskController = require("../controllers/task.controller");

router.post("/:projectId", verifyToken, taskController.createOneTask);

router.get("/:projectId/all-tasks", verifyToken, taskController.getAllTasks);

router.get("/:taskId", verifyToken, taskController.getOneTask);

router.get("/:projectId/my-tasks", verifyToken, taskController.getAllMyTasks);

router.put("/:taskId", verifyToken, taskController.updateOneTask);

router.delete("/:taskId", verifyToken, taskController.deleteOneTask);

module.exports = router;
