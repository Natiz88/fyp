const express = require("express");
const rewardLogController = require("./../controllers/rewardLogController");
const adminAuth = require("./../middlewares/adminAuth");

const rewardLogRouter = express.Router();
rewardLogRouter.route("/").post(rewardLogController.postRewardLog);
rewardLogRouter.route("/").get(rewardLogController.getRewardLog);
rewardLogRouter.route("/").delete(rewardLogController.deleteAllRewardLog);

rewardLogRouter
  .route("/:id")
  .get(rewardLogController.getIndividualRewardLog)
  .delete(rewardLogController.deleteRewardLog);

module.exports = rewardLogRouter;
