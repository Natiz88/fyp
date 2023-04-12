const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "question is required"],
    },
    answer: {
      type: String,
      required: [true, "answer is required"],
    },
    added_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const faq = mongoose.model("faqs", faqSchema);

module.exports = faq;
