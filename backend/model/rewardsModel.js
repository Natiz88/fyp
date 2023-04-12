const mongoose = require("mongoose");

const rewardsSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, "Value is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      unique: true,
    },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const rewards = mongoose.model("rewards", rewardsSchema);

module.exports = rewards;
