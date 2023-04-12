const mongoose = require("mongoose");
const validator = require("validator");

const ContactsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email field is reqired"],
      unique: true,
      lowercase: true,
      validator: [validator.isEmail, "invalid email"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Contacts = mongoose.model("contacts", ContactsSchema);

module.exports = Contacts;
