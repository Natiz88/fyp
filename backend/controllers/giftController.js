const Questions = require("../model/questionsModel");
const Answers = require("../model/answersModel");
const Rewards = require("../model/rewardsModel");
const RewardLog = require("../model/rewardLogModel");

const Notifications = require("../model/notificationModel");
const User = require("../model/userModel");
const Gift = require("../model/giftModel");

exports.getGifts = async (req, res) => {
  const { page = 1, limit = 12, search = "" } = req.query;
  try {
    let allGifts = await Gift.find()
      .populate({
        path: "added_by",
        select: [
          "full_name",
          "createdAt",
          "user_image",
          "user_role",
          "user_verified",
          "user_image",
        ],
      })
      .sort({ coins: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    let count = await Gift.countDocuments();
    res.status(200).json({
      status: "successfull",
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      results: count,
      data: {
        gifts: allGifts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getIndividualGift = async (req, res) => {
  console.log("gi ind");
  try {
    let gift = await Gift.findById(req.params.id).populate({
      path: "added_by",
      select: [
        "full_name",
        "createdAt",
        "user_image",
        "user_role",
        "user_verified",
        "user_image",
      ],
    });
    res.status(200).json({
      status: "successfull",
      data: {
        gift,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postGift = async (req, res) => {
  try {
    if (req.file) {
      console.log("file", req.file.filename);
      req.body.gift_image = req.file.filename;
    } else {
      console.log("file not found");
      req.body.gift_image = "logo.PNG";
    }
    req.body.added_by = req.user_id;
    const newGift = await Gift.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        gift: newGift,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateGift = async (req, res) => {
  console.log("gif", req.body);
  try {
    const allGifts = await Gift.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      status: "successfull",
      data: {
        gift: allGifts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        gift,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.hideGift = async (req, res) => {
  try {
    const allGifts = await Gift.findByIdAndUpdate(req.params.id, [
      { $set: { gift_hidden: { $not: "$gift_hidden" } } },
    ]);
    res.status(200).json({
      status: "successfull",
      data: {
        gift: allGifts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAllGifts = async (req, res) => {
  try {
    const gift = await Gift.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        gift,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
