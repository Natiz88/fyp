const express = require("express");
const auth = require("./../middlewares/auth");
const commentsController = require("./../controllers/commentsController");

const commentsRouter = express.Router();

commentsRouter.route("/").post(auth, commentsController.postcomment);

commentsRouter.route("/:id").get(commentsController.getIndividualComment);

commentsRouter
  .route("/deleteComment/:id")
  .post(auth, commentsController.deletecomment);

commentsRouter
  .route("/reportComment/:id")
  .put(auth, commentsController.reportComment);

commentsRouter
  .route("/reportedComments")
  .get(commentsController.reportedComments);

module.exports = commentsRouter;
