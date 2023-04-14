const Questions = require("../model/questionsModel");
const Answers = require("../model/answersModel");
const Rewards = require("../model/rewardsModel");
const RewardLog = require("../model/rewardLogModel");

const Notifications = require("../model/notificationModel");
const User = require("../model/userModel");

exports.getquestions = async (req, res) => {
  const { page = 1, limit = 10, tag = "" } = req.query;
  console.log("page", page);

  try {
    let allquestions =
      tag === null || tag === ""
        ? await Questions.find()
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
              path: "question_comments",
              populate: {
                path: "user_id",
                select: [
                  "full_name",
                  "user_image",
                  "user_role",
                  "user_verified",
                ],
              },
            })
            .populate({
              path: "question_answers",
              populate: {
                path: "user_id",
                select: [
                  "full_name",
                  "createdAt",
                  "user_role",
                  "user_verified",
                ],
              },
            })
            .populate({
              path: "user_id",
              select: [
                "full_name",
                "createdAt",
                "user_image",
                "user_role",
                "user_verified",
              ],
            })
            .exec()
        : await Questions.find({ question_tags: { $in: tag } })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
              path: "question_comments",
              populate: {
                path: "user_id",
                select: [
                  "full_name",
                  "user_image",
                  "user_role",
                  "user_verified",
                ],
              },
            })
            .populate({
              path: "question_answers",
              populate: {
                path: "user_id",
                select: [
                  "full_name",
                  "createdAt",
                  "user_role",
                  "user_verified",
                ],
              },
            })
            .populate({
              path: "user_id",
              select: [
                "full_name",
                "createdAt",
                "user_image",
                "user_role",
                "user_verified",
              ],
            })
            .exec();
    const count = await Questions.countDocuments(
      tag !== "" && {
        question_tags: { $in: tag },
      }
    );
    res.status(200).json({
      status: "successfull",
      results: allquestions.length,
      currentPage: page,
      totalPages: Math.ceil(count / limit),

      data: {
        questions: allquestions,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualquestion = async (req, res) => {
  try {
    const singleQuestion = await Questions.findById(req.params.id)
      .populate({
        path: "question_comments",
        populate: {
          path: "user_id",
          select: ["full_name", "user_image", "user_role", "user_verified"],
        },
      })
      .populate({
        path: "question_answers",
        populate: {
          path: "user_id",
          select: ["full_name", "user_image", "user_role", "user_verified"],
        },
      })
      .populate({
        path: "question_answers",
        populate: {
          path: "answer_comments",
          select: ["comment_body", "createdAt"],
          populate: {
            path: "user_id",
            select: ["full_name", "user_image", "user_role", "user_verified"],
          },
        },
      })
      .populate({
        path: "user_id",
        select: [
          "full_name",
          "createdAt",
          "user_image",
          "user_role",
          "user_verified",
        ],
      });
    res.status(200).json({
      status: "successfull",
      data: {
        question: singleQuestion,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.likeQuestion = async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);

    if (!question.question_likes.includes(req.user_id)) {
      await question.updateOne({ $push: { question_likes: req.user_id } });
      const user = await User.findById(req.user_id);
      await Notifications.create({
        message: `${user.full_name} liked your question`,
        question: question._id,
        sender: req.user_id,
        receiver: question.user_id,
      });
      res.status(200).json("The post has been liked");
    } else {
      await question.updateOne({
        $pull: { question_likes: req.user_id },
      });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postquestion = async (req, res) => {
  try {
    if (req.files) {
      req.body.question_images = req.files.map((file) => file.filename);
    }
    req.body.user_id = req.user_id;
    const newquestion = await Questions.create(req.body);
    const reward = await Rewards.find({ type: "Ask Question" });
    const user = await User.findById(newquestion.user_id);
    await RewardLog.create({
      value: reward[0].value,
      title: newquestion.question_title,
      type: "question",
      user_id: newquestion.user_id,
      question_id: newquestion._id,
    });
    await user.updateOne({
      $inc: { coins: reward[0].value },
    });
    res.status(201).json({
      status: "success",
      data: {
        question: newquestion,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportQuestion = async (req, res) => {
  try {
    req.body.user_id = req.user_id;
    const question = await Questions.findById(req.params.id);
    if (!question.question_reports.includes(req.user_id)) {
      await question.updateOne({ $push: { question_reports: req.user_id } });
    }
    res.status(201).json({
      status: "success",
      message: "The question was reported",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateAll = async (req, res) => {
  console.log("report", req.params.id, req.body.user_id, req.user_id);
  try {
    const question = await Questions.updateMany({ question_hidden: false });
    console.log(question);

    res.status(201).json({
      status: "success",
      message: "The question was reported",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updatequestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deletequestion = async (req, res) => {
  try {
    const question = await Questions.findById(req.params.id);
    question.remove();

    res.status(200).json({
      status: "successfull",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.hideQuestion = async (req, res) => {
  try {
    const question = await Questions.findByIdAndUpdate(req.params.id, [
      { $set: { question_hidden: { $not: "$question_hidden" } } },
    ]);
    await Questions.findByIdAndUpdate(req.params.id, {
      question_reports: [],
    });
    res.status(200).json({
      status: "successfull",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAllQuestion = async (req, res) => {
  try {
    const question = await Questions.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        question,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.popularTags = async (req, res) => {
  try {
    const tags = await Questions.aggregate([
      { $unwind: "$question_tags" },
      {
        $group: {
          _id: "$question_tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    console.log(tags);
    res.status(200).json({
      status: "successfull",
      results: tags.length,
      data: {
        tags,
      },
    });
  } catch (err) {
    res.status(404).json(err.message);
  }
};

exports.popularQuestions = async (req, res) => {
  //get current time
  let currentTime = new Date();
  //get from 7 days ago
  currentTime.setDate(currentTime.getDate() - 7);
  try {
    //sort posts by most likes and within 7 days ago, but with a max of 50 posts
    const mostPopular = await Questions.find({})
      .populate("question_answers")
      .populate("question_comments")
      .sort({ question_answers: -1, question_likes: -1, question_comments: -1 })
      .limit(5);

    res.status(200).json({
      status: "successfull",
      results: mostPopular.length,
      data: {
        question: mostPopular,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.searchQuestions = async (req, res) => {
  const { term } = req.query;
  console.log(term);

  try {
    const searchQuestion = await Questions.find({
      question_title: new RegExp(term, "i"),
    }).limit(10);

    res.status(200).json({
      status: "successfull",
      results: searchQuestion.length,
      data: {
        questions: searchQuestion,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.reportedQuestions = async (req, res) => {
  try {
    const reportedQuestions = await Questions.find({
      "question_reports.0": { $exists: true },
    }).populate({
      path: "user_id",
      select: ["full_name", "user_image", "user_role", "user_verified"],
    });

    res.status(200).json({
      status: "successfull",
      results: reportedQuestions.length,
      data: {
        questions: reportedQuestions,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
exports.clearReportedQuestion = async (req, res) => {
  console.log("report");
  const { id } = req.params;
  try {
    await Questions.findByIdAndUpdate(id, {
      $set: { question_reports: [] },
    });

    res.status(200).json({
      status: "successfull",
      message: "The question was cleared",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.searchTags = async (req, res) => {
  const { term } = req.query;
  try {
    const searchTag = await Questions.aggregate([
      { $unwind: "$question_tags" },
      { $match: { question_tags: { $regex: new RegExp(term, "i") } } },
      {
        $group: {
          _id: "$question_tags",
          count: { $sum: 1 },
        },
      },

      { $limit: 10 },
    ]);

    res.status(200).json({
      status: "successfull",
      results: searchTag.length,
      data: {
        questions: searchTag,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.searchTags = async (req, res) => {
  const { term } = req.query;
  try {
    const searchTag = await Questions.aggregate([
      { $unwind: "$question_tags" },
      { $match: { question_tags: { $regex: new RegExp(term, "i") } } },
      {
        $group: {
          _id: "$question_tags",
          count: { $sum: 1 },
        },
      },

      { $limit: 10 },
    ]);

    res.status(200).json({
      status: "successfull",
      results: searchTag.length,
      data: {
        questions: searchTag,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.hiddenQuestions = async (req, res) => {
  try {
    const questions = await Questions.find({
      user_id: req.params.id,
      question_hidden: true,
    }).populate("user_id");

    res.status(200).json({
      status: "successfull",
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
