const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
  {
    gift_name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    gift_image: {
      type: String,
    },
    gift_price: {
      type: Number,
      required: [true, "price is required"],
    },
    gift_description: {
      type: String,
    },
    gift_hidden: {
      type: Boolean,
      default: false,
    },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const gift = mongoose.model("gifts", giftSchema);

module.exports = gift;
