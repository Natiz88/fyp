const express = require("express");
const contactsController = require("./../controllers/contactsController");
const adminAuth = require("./../middlewares/adminAuth");

const contactsRouter = express.Router();
contactsRouter.route("/").post(contactsController.postContacts);
contactsRouter.route("/").get(contactsController.getContacts);
contactsRouter.route("/:id").delete(contactsController.deleteContact);
contactsRouter.route("/all").delete(contactsController.deleteAllContacts);

module.exports = contactsRouter;
