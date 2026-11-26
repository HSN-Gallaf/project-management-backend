const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const projectController = require("../controllers/project.controller");

router.post("/", verifyToken, projectController.createOneProject);

router.get("/", verifyToken, projectController.getAllProjects);

router.get("/my-projects", verifyToken, projectController.getAllMyProjects);

router.get("/:projectId", verifyToken, projectController.getOneProject);

router.put("/:projectId", verifyToken, projectController.updateOneProject);

router.put(
  "/:projectId/update-memebers",
  verifyToken,
  projectController.updateMembers,
);

module.exports = router;
