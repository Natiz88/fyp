const express = require("express");
const userImage = require("./../middlewares/userImageUpload");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const { uploadUserPhoto } = require("./../middlewares/userImageUpload");
const { uploadSinglePhoto } = require("./../middlewares/uploadSingleUser");
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");

const userRouter = express.Router();
userRouter.route("/signup").post(authController.signup);
userRouter.route("/dashboard").get(userController.dashboardDetails);
userRouter
  .route("/teacherSignup")
  .post(uploadUserPhoto, authController.teacherSignup);
userRouter
  .route("/teacherLoggedinSignup")
  .post(uploadUserPhoto, authController.teacherLoggedinSignup);
userRouter.route("/adminLogin").post(authController.adminLogin);
userRouter.route("/login").post(authController.login);
userRouter.route("/checkEmail/:email").get(userController.checkEmail);
userRouter.route("/rewards").get(userController.getAllCoins);
userRouter.route("/pendingUsers").get(userController.pendingUsers);

userRouter
  .route("/:id")
  .get(userController.getIndividualUser)
  .put(auth, uploadSinglePhoto, userController.updateUser)
  .delete(userController.deleteUser);

userRouter
  .route("/verifyTeacher/:id")
  .put(adminAuth, userController.verifyTeacher);

userRouter.post("/sendLink", authController.sendLink);
userRouter.post("/newpassword", authController.newPassword);
userRouter
  .route("/cancelVerification/:id")
  .put(adminAuth, userController.cancelVerification);
userRouter.route("/getCoins/:id").get(userController.getCoins);
userRouter.route("/changePassword/:id").post(authController.changePassword);

userRouter.route("/").get(userController.getUsers);
userRouter.route("/banUser/:id").post(userController.banUser);
userRouter.route("/unbanUser/:id").post(userController.unbanUser);

module.exports = userRouter;
