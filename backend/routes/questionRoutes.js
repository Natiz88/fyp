const express = require("express");
const auth = require("../middlewares/auth");
const ownAuth = require("../middlewares/ownAuth");
const { uploadQuestionPhoto } = require("../middlewares/questionImageUpload");
const questionsController = require("./../controllers/questionsController");

const questionsRouter = express.Router();

questionsRouter
  .route("/")
  .post(auth, uploadQuestionPhoto, questionsController.postquestion);
questionsRouter.route("/").get(questionsController.getquestions);

questionsRouter.route("/popularTags").get(questionsController.popularTags);
questionsRouter
  .route("/deleteAllQuestions")
  .delete(questionsController.deleteAllQuestion);
questionsRouter
  .route("/popularQuestions")
  .get(questionsController.popularQuestions);
questionsRouter
  .route("/searchQuestions")
  .get(questionsController.searchQuestions);
questionsRouter.route("/searchTags").get(questionsController.searchTags);
questionsRouter
  .route("/reportQuestion/:id")
  .post(auth, questionsController.reportQuestion);

questionsRouter
  .route("/clearReportedQuestion/:id")
  .post(questionsController.clearReportedQuestion);
questionsRouter
  .route("/hiddenQuestions/:id")
  .get(questionsController.hiddenQuestions);
questionsRouter
  .route("/reportedQuestions")
  .get(questionsController.reportedQuestions);

questionsRouter
  .route("/:id")
  .get(questionsController.getIndividualquestion)
  //   .put(userController.uploadUserPhoto, userController.updateUser)
  .delete(questionsController.deletequestion);

questionsRouter.route("/like/:id").put(auth, questionsController.likeQuestion);
questionsRouter
  .route("/hideQuestion/:id")
  .post(ownAuth, questionsController.hideQuestion);

module.exports = questionsRouter;
