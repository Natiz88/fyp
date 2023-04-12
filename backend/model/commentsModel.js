const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    comment_body: {
      type: String,
      required: [true, "Answer cannot be empty"],
    },
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
    },
    answer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "questions",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "users",
      default: [],
    },
    comment_reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const Comments = mongoose.model("comments", commentsSchema);

module.exports = Comments;
