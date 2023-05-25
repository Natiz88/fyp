const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    gift: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "gifts",
      required: true,
    },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const exchanges = mongoose.model("exchanges", exchangeSchema);

module.exports = exchanges;
