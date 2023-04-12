const comments = require("../model/commentsModel");
const Answers = require("../model/answersModel");
const Questions = require("../model/questionsModel");
const Comments = require("../model/commentsModel");
const Notifications = require("../model/notificationModel");
const User = require("../model/userModel");

exports.getIndividualComment = async (req, res) => {
  try {
    const singleComment = await Comments.findById(req.params.id).populate({
      path: "user_id",
      select: ["full_name", "user_image", "user_role", "user_verified"],
    });
    res.status(200).json({
      status: "successfull",
      data: {
        comment: singleComment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postcomment = async (req, res) => {
  req.body.user_id = req.user_id;
  try {
    if (!req.body.question_id && !req.body.answer_id) {
      return res.status(404).json("missing fields");
    }
    const newcomment = await Comments.create(req.body);
    let question;
    if (req.body.question_id) {
      question = await Questions.findById(req.body.question_id);
    }
    if (question.user_id.toString() === newcomment.user_id.toString()) {
      return res.status(201).json({
        status: "success",
        data: {
          comment: newcomment,
        },
      });
    } else {
      const user = await User.findById(req.body.user_id);
      if (req.body.question_id) {
        await Notifications.create({
          message: `${user.full_name} commented on your question`,
          question: newcomment.question_id,
          sender: newcomment.user_id,
          receiver: question.user_id,
        });
      } else if (req.body.answer_id) {
        const answer = await Answers.findById(req.body.answer_id);
        await Notifications.create({
          message: `${user.full_name} replied to your answer`,
          question: answer.question_id,
          sender: user._id,
          receiver: answer.user_id,
        });
        await Notifications.create({
          message: `${user.full_name} commented on your question`,
          question: answer.question_id,
          sender: user._id,
          receiver: question.user_id,
        });
      }
      res.status(201).json({
        status: "success",
        data: {
          comment: newcomment,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updatecomment = async (req, res) => {
  try {
    const comment = await Comments.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: "successfull",
      data: {
        comment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deletecomment = async (req, res) => {
  console.log("dele");
  try {
    const findComment = await Comments.findById(req.params.id);
    if (String(findComment.user_id) !== String(req.user_id)) {
      res.status(401).json({
        message: "you are not authorized",
      });
    } else {
      const comment = await Comments.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: "successfull",
        data: {
          comment,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportComment = async (req, res) => {
  try {
    req.body.user_id = req.user_id;
    const comment = await Comments.findById(req.params.id);
    if (!comment.comment_reports.includes(req.user_id)) {
      await comment.updateOne({ $push: { comment_reports: req.user_id } });
    }
    res.status(201).json({
      status: "success",
      message: "The comment was reported",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportedComments = async (req, res) => {
  console.log("reported");
  try {
    const reportedComments = await Comments.find({
      "comment_reports.0": { $exists: true },
    }).populate({
      path: "user_id",
      select: ["full_name", "user_image", "user_role", "user_verified"],
    });

    res.status(200).json({
      status: "successfull",
      results: reportedComments.length,
      data: {
        questions: reportedComments,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
