const RewardLog = require("../model/rewardLogModel");

exports.getRewardLog = async (req, res) => {
  try {
    const allRewards = await RewardLog.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
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
exports.getIndividualRewardLog = async (req, res) => {
  try {
    const singleRewards = await RewardLog.find({
      user_id: req.params.id,
    }).populate({
      path: "user_id",
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

exports.postRewardLog = async (req, res) => {
  try {
    const newRewards = await RewardLog.create({
      type: req.body.type,
      value: req.body.value,
      title: req.body.title,
      user_id: req.user_id,
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

// exports.updateRewards = async (req, res) => {
//   try {
//     const reward = await RewardLog.findByIdAndUpdate(req.params.id, {
//       value: req.body.value,
//       updated_by: req.user_id,
//     });
//     res.status(200).json({
//       status: "successfull",
//       data: {
//         reward,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "failed",
//       message: err.message,
//     });
//   }
// };

exports.deleteRewardLog = async (req, res) => {
  try {
    const Rewards = await RewardLog.findByIdAndDelete(req.params.id);
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

exports.deleteAllRewardLog = async (req, res) => {
  try {
    const Rewards = await RewardLog.deleteMany();
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
