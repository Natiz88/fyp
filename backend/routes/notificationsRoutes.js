const express = require("express");
const notificationsController = require("./../controllers/notificationsController");

const notificationsRouter = express.Router();
notificationsRouter.route("/").post(notificationsController.postNotification);
notificationsRouter.route("/").get(notificationsController.getNotifications);
notificationsRouter
  .route("/")
  .delete(notificationsController.deleteAllNotification);

notificationsRouter
  .route("/:id")
  .get(notificationsController.getIndividualNotifications)
  .put(notificationsController.updateNotification)
  .delete(notificationsController.deleteNotification);

module.exports = notificationsRouter;
