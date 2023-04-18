const mongoose = require("mongoose");
const Comments = require("./../model/commentsModel");

const answersSchema = new mongoose.Schema(
  {
    answer_body: { type: String, required: [true, "Answer cannot be empty"] },
    answer_images: [],
    question_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Question is required"],
      ref: "questions",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "users",
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    answer_reports: [
      { type: mongoose.Schema.Types.ObjectId, ref: "users", default: [] },
    ],
    answer_accepted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

answersSchema.virtual("answer_comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "answer_id",
});

answersSchema.pre("remove", function (next) {
  Comments.deleteMany({ answer_id: this._id }, next);
  next();
});

answersSchema.virtual("answer_image").get(function () {
  if (this.answer_images === []) {
    return [];
  }
  images = [];
  this.answer_images.forEach((image) =>
    images.push(`http://localhost:5000/static/answers/${image}`)
  );
  return images;
});

const Answers = mongoose.model("answers", answersSchema);
module.exports = Answers;
