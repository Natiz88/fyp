const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      unique: true,
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
  },
  { timestamps: true }
);

const tokens = mongoose.model("tokens", tokenSchema);

module.exports = tokens;
