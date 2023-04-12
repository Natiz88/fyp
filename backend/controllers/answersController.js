const Answers = require("../model/answersModel");
const Questions = require("../model/questionsModel");
const Notifications = require("../model/notificationModel");
const Rewards = require("../model/rewardsModel");
const RewardLog = require("../model/rewardLogModel");
const User = require("../model/userModel");

exports.getAnswers = async (req, res) => {
  try {
    const allAnswers = await Answers.find({})
      .populate({
        path: "user_id",
        select: [
          "full_name",
          "user_image",
          "createdAt",
          "user_role",
          "user_verified",
        ],
      })
      .populate({
        path: "answer_comments",
        populate: {
          path: "user_id",
          select: ["full_name", "user_image", "createdAt"],
        },
      })
      .sort({ "user_id.user_verified": "asc" });
    res.status(200).json({
      status: "successfull",
      results: allAnswers.length,
      data: {
        answers: allAnswers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualAnswer = async (req, res) => {
  try {
    const singleAnswer = await Answers.findById(req.params.id)
      .populate({
        path: "user_id",
        select: [
          "full_name",
          "user_image",
          "createdAt",
          "user_role",
          "user_verified",
        ],
      })
      .populate({
        path: "answer_comments",
        populate: {
          path: "user_id",
          select: ["full_name", "user_image", "createdAt"],
        },
      });
    res.status(200).json({
      status: "successfull",
      data: {
        answer: singleAnswer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postAnswer = async (req, res) => {
  if (req.files) {
    req.body.answer_images = req.files.map((file) => file.filename);
  }
  req.body.user_id = req?.user_id || req?.body?.user_id;
  try {
    const newAnswer = await Answers.create(req.body);
    const question = await Questions.findById(newAnswer.question_id);
    const reward = await Rewards.find({ type: "Answer Question" });
    await RewardLog.create({
      value: reward[0].value,
      title: newAnswer.answer_body,
      type: "answer",
      user_id: newAnswer.user_id,
      question_id: question._id,
    });
    const user = await User.findById(newAnswer.user_id);
    await user.updateOne({
      $inc: { coins: reward[0].value },
    });
    if (String(newAnswer.user_id) === String(question.user_id)) {
      return res.status(201).json({
        status: "success",
        data: {
          answer: newAnswer,
        },
      });
    } else {
      await Notifications.create({
        message: `${user.full_name} answered your question`,
        question: question.question_id,
        sender: user._id,
        receiver: question.user_id,
      });
      return res.status(201).json({
        status: "success",
        data: {
          answer: newAnswer,
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

exports.upvoteAnswer = async (req, res) => {
  req.body.user_id = req.user_id;
  try {
    const answer = await Answers.findById(req.params.id).populate("user_id");
    const reward = await Rewards.find({ type: "Answer Upvoted" });
    await RewardLog.create({
      value: reward[0].value,
      title: answer.answer_body,
      type: "upvote",
      user_id: answer.user_id._id,
      question_id: answer.question_id,
    });
    if (!answer.upvotes.includes(req.body.user_id)) {
      await answer.updateOne({ $push: { upvotes: req.body.user_id } });
      if (String(answer.user_id) !== String(req.body.user_id)) {
        res.status(200).json({
          status: "success",
          message: "The post has been upvoted",
          data: {
            answer,
          },
        });
      } else {
        await answer.updateOne({ $pull: { downvotes: req.body.user_id } });
        const user = awaitUser.findByIdandUpdate(req.body.user_id, {
          $inc: { coins: reward[0].value },
        });
        await Notifications.create({
          message: `${user.full_name} upvoted your answer`,
          question: answer.question_id,
          sender: user._id,
          receiver: answer.user_id,
        });
        res.status(200).json({
          status: "success",
          message: "The post has been upvoted",
          data: {
            answer,
          },
        });
      }
    } else {
      await answer.updateOne({
        $pull: { upvotes: req.body.user_id },
      });
      res.status(200).json({
        status: "success",
        message: "The post has been upvoted",
        data: {
          answer,
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

exports.downvoteAnswer = async (req, res) => {
  req.body.user_id = req.user_id;
  try {
    const answer = await Answers.findById(req.params.id);
    if (!answer.downvotes.includes(req.body.user_id)) {
      await answer.updateOne({ $push: { downvotes: req.body.user_id } });
      await answer.updateOne({ $pull: { upvotes: req.body.user_id } });
      await Notifications.create({
        message: `${
          answer.user_id._id === req.user_id ? answer.user_id.full_name : "you"
        } downvoted your answer`,
        question: answer.question_id,
        receiver: answer.user_id,
      });
      res.status(200).json({
        status: "success",
        message: "The post has been downvoted",
        data: {
          answer,
        },
      });
    } else {
      await answer.updateOne({ $pull: { downvotes: req.body.user_id } });
      res.status(200).json({
        status: "success",
        message: "The post downvote has been cancelled",
        data: {
          answer,
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

exports.updateAnswer = async (req, res) => {
  req.body.user_id = req.user_id;
  try {
    const answer = await Answers.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        answer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.acceptAnswer = async (req, res) => {
  try {
    const answer = await Answers.findById(req.params.id);
    const question = await Questions.findById(answer.question_id);
    if (question.user_id.equals(req.user_id)) {
      await Answers.updateMany(
        { answer_accepted: true },
        { $set: { answer_accepted: false } }
      );
      await Answers.findByIdAndUpdate(req.params.id, {
        answer_accepted: !answer.answer_accepted,
      });

      const reward = await Rewards.find({ type: "Answer Accepted" });
      await RewardLog.create({
        value: reward[0].value,
        title: answer.answer_body,
        type: "accepted",
        user_id: answer.user_id,
      });
      const user = await User.findById(question.user_id);
      const answerUser = await User.findByIdAndUpdate(answer.user_id, {
        $inc: { coins: reward[0].value },
      });
      await Notifications.create({
        message: `${user.full_name} ${
          answer.answer_accepted ? "declined" : "accepted"
        } your answer`,
        question: answer.question_id,
        receiver: answer.user_id,
      });
      res.status(200).json({
        status: "successfull",
      });
    } else {
      res.status(401).json({
        status: "failed",
        message: "You are not authorized",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answers.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        answer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportAnswer = async (req, res) => {
  try {
    req.body.user_id = req.user_id;
    const answer = await Answers.findById(req.params.id);
    if (!answer.answer_reports.includes(req.user_id)) {
      await answer.updateOne({ $push: { answer_reports: req.user_id } });
    }
    res.status(201).json({
      status: "success",
      message: "The answer was reported",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportedAnswers = async (req, res) => {
  try {
    const reportedAnswers = await Answers.find({
      "answer_reports.0": { $exists: true },
    }).populate({
      path: "user_id",
      select: ["full_name", "user_image", "user_role", "user_verified"],
    });

    res.status(200).json({
      status: "successfull",
      results: reportedAnswers.length,
      data: {
        answers: reportedAnswers,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
