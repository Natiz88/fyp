const fs = require("fs");
const User = require("../model/userModel");
const Question = require("../model/questionsModel");
const sendEmail = require("./../middlewares/sendEmail");

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    let allUsers = await User.find({
      full_name: new RegExp(search, "i"),
    })
      .sort({ coins: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate({
        path: "questionsAsked",
        populate: {
          path: "user_id",
          select: ["full_name", "createdAt"],
        },
      });
    let count = await User.countDocuments();
    res.status(200).json({
      status: "successfull",
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      results: count,
      data: {
        users: allUsers,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualUser = async (req, res) => {
  try {
    const singleUser = await User.findById(req.params.id)
      .populate({
        path: "questionsAsked",
        select: [
          "user_id",
          "questions_comments",
          "questions_answers",
          "questions_likes",
          "question_title",
          "question_body",
          "question_images",
          "createdAt",
        ],
      })
      .populate({
        path: "questionsAnswered",
        populate: {
          path: "question_id",
          select: ["question_title"],
        },
      })
      .populate({
        path: "questionsAsked",
        populate: {
          path: "user_id",
          select: ["full_name", "last_name", "createdAt", "user_image"],
        },
      });
    res.status(200).json({
      status: "successfull",
      data: {
        user: singleUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
// exports.postUser = async (req, res) => {
//   try {
//     const newUser = await User.create(req.body);
//     res.status(201).json({
//       status: "success",
//       data: {
//         user: newUser,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "failed",
//       message: err,
//     });
//   }
// };

exports.updateUser = async (req, res) => {
  console.log("req.body", req.body);
  if (req.file) {
    req.body.user_image = req.file.filename;
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      user_banned: true,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      user_banned: false,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.reportUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $push: { user_reported: req.user_id },
    });
    res.status(200).json({
      status: "successfull",
      data: {
        user: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const user = await User.find({ email: req.params.email });
    if (user.length === 0) {
      res.status(200).json({
        message: "Email does not exist",
      });
    } else {
      res.status(404).json({
        message: "Email already exists",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getCoins = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "successfull",
      coins: user.coins,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getAllCoins = async (req, res) => {
  try {
    const rewards = await User.find({}).sort({ coins: -1 });
    res.status(200).json({
      status: "successfull",
      rewards,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.verifyTeacher = async (req, res) => {
  console.log("verify");
  const { adminId } = req.user_id;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      user_role: "teacher",
      user_verified: "positive",
      verified_by: adminId,
    });
    res.status(200).json({
      status: "success",
      message: "Teacher Verification Successfull",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.cancelVerification = async (req, res) => {
  const { reject } = req.body;
  console.log("ver cancl", reject);

  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      user_role: "student",
      user_verified: "negative",
      verified_by: "",
    });
    await sendEmail(
      "bistanatiz7@gmail.com",
      "User verification cancelled",
      `Your account couldn't be verified because ${reject}`
    );
    res.status(200).json({
      status: "success",
      message: "Teacher Verification Cancelled",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.pendingUsers = async (req, res) => {
  try {
    const users = await User.find({
      user_verified: "pending",
    });
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.dashboardDetails = async (req, res) => {
  // const { adminId } = req.user_id;
  console.log("dash");
  try {
    const users = await User.countDocuments();
    const pendingVerifications = await User.countDocuments({
      user_verified: "pending",
    });
    const questions = await Question.count();
    const teachers = await User.count({ user_role: "teacher" });
    const students = await User.count({ user_role: "student" });
    res.status(200).json({
      status: "success",
      data: {
        users,
        questions,
        teachers,
        students,
        pendingVerifications,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
