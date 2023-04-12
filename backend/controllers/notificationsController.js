const Notifications = require("../model/notificationModel");

exports.getNotifications = async (req, res) => {
  try {
    const allNotifications = await Notifications.find().populate({
      path: "sender",
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
      results: allNotifications.length,
      data: {
        Notifications: allNotifications,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.getIndividualNotifications = async (req, res) => {
  try {
    const singleNotification = await Notifications.find({
      receiver: req.params.id,
    }).populate({
      path: "sender",
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
        notifications: singleNotification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.postNotification = async (req, res) => {
  try {
    const newNotification = await Notifications.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        Notifications: newNotification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const Notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).json({
      status: "successfull",
      data: {
        Notification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
exports.readNotification = async (req, res) => {
  try {
    const Notification = await Notifications.findByIdAndUpdate(req.params.id, {
      read: false,
    });
    res.status(200).json({
      status: "successfull",
      data: {
        Notification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const Notification = await Notifications.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "successfull",
      data: {
        Notifications: Notification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.deleteAllNotification = async (req, res) => {
  try {
    const Notification = await Notifications.deleteMany();
    res.status(200).json({
      status: "successfull",
      data: {
        Notifications: Notification,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
