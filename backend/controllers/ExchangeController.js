const Exchange = require("../model/exchangeModel");
const Gift = require("../model/giftModel");
const User = require("../model/userModel");
const RewardLog = require("../model/rewardLogModel");

exports.getExchange = async (req, res) => {
  try {
    const allExchanges = await Exchange.find()
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
        path: "gift",
        select: ["gift_name", "gift_price", "gift_image", "gift_description"],
      });
    res.status(200).json({
      status: "successfull",
      results: allExchanges.length,
      data: {
        Exchanges: allExchanges,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.getIndividualExchange = async (req, res) => {
  try {
    const singleExchange = await Exchange.find({ user_id: req.params.id })
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
        path: "gift",
        select: ["gift_name", "gift_price", "gift_image", "gift_description"],
      });
    res.status(200).json({
      status: "successfull",
      data: {
        Exchanges: singleExchange,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postExchange = async (req, res) => {
  try {
    const { user_id, gift_id } = req.body;
    if (!user_id || !gift_id) {
      return res.status(400).json({
        status: "failed",
        message: "missing fields",
      });
    }
    const price = await Gift.findById(gift_id);
    await User.findByIdAndUpdate(user_id, {
      $inc: { coins: -price.gift_price },
    });
    await RewardLog.create({
      value: 10,
      title: "You exchanged a gift",
      type: "gift",
      user_id: user_id,
    });
    const newExchange = await Exchange.create({
      user_id: user_id,
      gift: gift_id,
    });
    res.status(201).json({
      status: "success",
      data: {
        Exchanges: newExchange,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

// exports.updateExchanges = async (req, res) => {
//   try {
//     const { question, answer } = req.body;
//     const updated_by = req.user_id;
//     const reward = await Exchange.findByIdAndUpdate(req.params.id, {
//       question,
//       answer,
//       updated_by,
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

// exports.deleteExchange = async (req, res) => {
//   try {
//     const Exchanges = await Exchange.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: "successfull",
//       data: {
//         Exchanges: Exchanges,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "failed",
//       message: err.message,
//     });
//   }
// };

exports.deleteAllExchange = async (req, res) => {
  try {
    const Exchanges = await Exchange.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        Exchanges: Exchanges,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
