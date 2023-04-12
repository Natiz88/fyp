const express = require("express");
const rewardsController = require("./../controllers/rewardsController");
const adminAuth = require("./../middlewares/adminAuth");

const rewardsRouter = express.Router();
rewardsRouter.route("/").post(rewardsController.postRewards);
rewardsRouter.route("/").get(rewardsController.getRewards);
rewardsRouter.route("/").delete(rewardsController.deleteAllRewards);

rewardsRouter
  .route("/:id")
  .get(rewardsController.getIndividualRewards)
  .put(adminAuth, rewardsController.updateRewards)
  .delete(rewardsController.deleteRewards);

module.exports = rewardsRouter;
