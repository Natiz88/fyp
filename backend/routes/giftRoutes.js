const express = require("express");
const GiftsController = require("./../controllers/giftController");
const adminAuth = require("./../middlewares/adminAuth");
const { uploadGiftPhoto } = require("./../middlewares/giftImageUpload");

const GiftRouter = express.Router();
GiftRouter.route("/").post(
  adminAuth,
  uploadGiftPhoto,
  GiftsController.postGift
);
GiftRouter.route("/").get(GiftsController.getGifts);
GiftRouter.route("/").delete(GiftsController.deleteAllGifts);

GiftRouter.route("/:id")
  //   .get(GiftController.getIndividualGift)
  .put(adminAuth, GiftsController.updateGift)
  .delete(GiftsController.deleteGift);

GiftRouter.route("/hideGift/:id").put(GiftsController.hideGift);

module.exports = GiftRouter;
