const express = require("express");
const FAQController = require("./../controllers/faqController");
const adminAuth = require("./../middlewares/adminAuth");

const FAQRouter = express.Router();
FAQRouter.route("/").post(adminAuth, FAQController.postFAQ);
FAQRouter.route("/").get(FAQController.getFAQ);
FAQRouter.route("/").delete(FAQController.deleteAllFAQ);

FAQRouter.route("/:id")
  .get(FAQController.getIndividualFAQ)
  .put(adminAuth, FAQController.updateFAQs)
  .delete(FAQController.deleteFAQ);

module.exports = FAQRouter;
