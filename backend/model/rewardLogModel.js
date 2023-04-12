const mongoose = require("mongoose");

const rewardLogSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, "Value is required"],
    },
    type: {
      type: String,
    },
    title: {
      type: String,
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: "questions" },
  },
  { timestamps: true }
);

const rewardLog = mongoose.model("rewardLogs", rewardLogSchema);

module.exports = rewardLog;
