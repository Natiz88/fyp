const express = require("express");
const ExchangeController = require("./../controllers/ExchangeController");
const adminAuth = require("./../middlewares/adminAuth");

const ExchangeRouter = express.Router();
ExchangeRouter.route("/").post(ExchangeController.postExchange);
ExchangeRouter.route("/").get(ExchangeController.getExchange);
ExchangeRouter.route("/").delete(ExchangeController.deleteAllExchange);

ExchangeRouter.route("/:id").get(ExchangeController.getIndividualExchange);
//   .put(adminAuth, ExchangeController.updateFAQs)
//   .delete(ExchangeController.deleteFAQ);

module.exports = ExchangeRouter;
