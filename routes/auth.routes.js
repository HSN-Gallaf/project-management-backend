const router = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const authController = require("../controllers/auth.controller");

router.post("/sign-up", authController.signUp);

router.post("/sign-in", authController.signIn);

router.get("/me", verifyToken, authController.verifyUser);

router.put("/:userId", verifyToken, authController.updateOneUser);

router.put(
  "/:userId/change-role",
  verifyToken,

  authController.changeUserRole,
);

module.exports = router;
