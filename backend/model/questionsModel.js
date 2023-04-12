const mongoose = require("mongoose");
const Answers = require("./answersModel");
const Comments = require("./commentsModel");

const questionsSchema = new mongoose.Schema(
  {
    question_title: {
      type: String,
      required: [true, "Title is required"],
    },
    question_body: {
      type: String,
    },
    question_reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    question_likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    question_tags: [],
    question_images: [],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "users",
    },
    question_hidden: {
      type: Boolean,
      defaul: false,
    },

    question_banned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

questionsSchema.virtual("question_answers", {
  ref: "answers",
  localField: "_id",
  foreignField: "question_id",
});

questionsSchema.virtual("question_comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "question_id",
});

questionsSchema.pre("remove", function (next) {
  Answers.deleteMany({ question_id: this._id }, next);
  Comments.deleteMany({ question_id: this._id }, next);
  next();
});

const Questions = mongoose.model("questions", questionsSchema);

module.exports = Questions;
