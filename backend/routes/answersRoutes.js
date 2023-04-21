const express = require("express");
const auth = require("./../middlewares/auth");
const answersController = require("./../controllers/answersController");
const { uploadAnswerPhoto } = require("../middlewares/answerImageUpload");

const answersRouter = express.Router();

answersRouter
  .route("/")
  .post(auth, uploadAnswerPhoto, answersController.postAnswer);
answersRouter.route("/").get(answersController.getAnswers);

answersRouter
  .route("/acceptAnswer/:id")
  .put(auth, answersController.acceptAnswer);

answersRouter
  .route("/reportAnswer/:id")
  .put(auth, answersController.reportAnswer);

answersRouter.route("/reportedAnswers").get(answersController.reportedAnswers);

answersRouter.route("/:id").get(answersController.getIndividualAnswer);
answersRouter
  .route("/deleteAnswer/:id")
  .post(auth, answersController.deleteAnswer);

answersRouter.route("/upvote/:id").put(auth, answersController.upvoteAnswer);
answersRouter
  .route("/downvote/:id")
  .put(auth, answersController.downvoteAnswer);

module.exports = answersRouter;
