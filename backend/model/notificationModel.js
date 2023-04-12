const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "notification is required"],
    },
    read: { type: Boolean, default: false },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("notifications", notificationsSchema);

module.exports = Notifications;
