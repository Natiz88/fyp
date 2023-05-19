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

exports.postGift = async (req, res) => {
  try {
    if (req.files) {
      console.log("image found");
      req.body.gift_image = req.files.map((file) => file.filename);
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
  try {
    const allGifts = await Gift.findByIdAndUpdate(req.params.id, {
      new: true,
      runValidators: true,
    });
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
    const gift = await Gift.findById(req.params.id);
    Gift.remove();

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
