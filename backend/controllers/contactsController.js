const Contacts = require("../model/ContactsModel");

exports.getContacts = async (req, res) => {
  try {
    const allContacts = await Contacts.find();
    res.status(200).json({
      status: "successfull",
      results: allContacts.length,
      data: {
        Contacts: allContacts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postContacts = async (req, res) => {
  try {
    const newContacts = await Contacts.create({
      email: req.body.email,
      message: req.body.message,
    });
    res.status(201).json({
      status: "success",
      data: {
        Contacts: newContacts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.deleteContact = async (req, res) => {
  try {
    await Contacts.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.deleteAllContacts = async (req, res) => {
  try {
    await Contacts.findAndDelete();
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
