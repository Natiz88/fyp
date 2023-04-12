const FAQ = require("../model/faqModel");

exports.getFAQ = async (req, res) => {
  try {
    const allFAQs = await FAQ.find()
      .populate({
        path: "added_by",
        select: [
          "full_name",
          "user_image",
          "createdAt",
          "user_role",
          "user_verified",
        ],
      })
      .populate({
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
      results: allFAQs.length,
      data: {
        FAQs: allFAQs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualFAQ = async (req, res) => {
  console.log("faq");
  try {
    const singleFAQs = await FAQ.findById(req.params.id)
      .populate({
        path: "added_by",
        select: [
          "full_name",
          "user_image",
          "createdAt",
          "user_role",
          "user_verified",
        ],
      })
      .populate({
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
      data: {
        FAQs: singleFAQs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const added_by = req.user_id;
    if (!question || !answer || !added_by) {
      return res.status(400).json({
        status: "failed",
        message: "missing fields",
      });
    }
    const newFAQs = await FAQ.create({ question, answer, added_by });
    res.status(201).json({
      status: "success",
      data: {
        FAQs: newFAQs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateFAQs = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updated_by = req.user_id;
    const reward = await FAQ.findByIdAndUpdate(req.params.id, {
      question,
      answer,
      updated_by,
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

exports.deleteFAQ = async (req, res) => {
  try {
    const FAQs = await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        FAQs: FAQs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.deleteAllFAQ = async (req, res) => {
  try {
    const FAQs = await FAQ.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        FAQs: FAQs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
