const express = require("express");
const userController = require("../controllers/userControler");
const authController = require("../controllers/authController");

const router = express.Router();
console.log(userController.signup);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.delete("/deleteMe", authController.protect, userController.deleteMe);

router.patch(
  "/deactivateUser/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deactivateUser
);

router.get("/", authController.protect, userController.getAllUsers);

module.exports = router;
