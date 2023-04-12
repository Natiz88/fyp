const Rewards = require("../model/rewardsModel");

exports.getRewards = async (req, res) => {
  try {
    const allRewards = await Rewards.find().populate({
      path: "updated_by",
      select: [
        "full_name",
        "user_image",
        "createdAt",
        "user_role",
        "user_verified",
      ],
    });
    res.status(200).json({
      status: "successfull",
      results: allRewards.length,
      data: {
        Rewards: allRewards,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualRewards = async (req, res) => {
  try {
    const singleRewards = await Rewards.find({
      receiver: req.params.id,
    }).populate({
      path: "updated_by",
      select: [
        "full_name",
        "user_image",
        "createdAt",
        "user_role",
        "user_verified",
      ],
    });
    res.status(200).json({
      status: "successfull",
      results: singleRewards.length,
      data: {
        Rewards: singleRewards,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postRewards = async (req, res) => {
  try {
    const newRewards = await Rewards.create({
      type: req.body.type,
      value: req.body.value,
      updated_by: req.user_id,
    });
    res.status(201).json({
      status: "success",
      data: {
        rewards: newRewards,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateRewards = async (req, res) => {
  console.log("reward", req.params.id, req.body);
  try {
    const reward = await Rewards.findByIdAndUpdate(req.params.id, {
      value: req.body.value,
      updated_by: req.user_id,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        reward,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteRewards = async (req, res) => {
  try {
    const Rewards = await Rewards.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        Rewards: Rewards,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAllRewards = async (req, res) => {
  try {
    const Rewards = await Rewards.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        Rewards: Rewards,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
