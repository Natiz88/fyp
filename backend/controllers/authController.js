const User = require("./../model/userModel");
const userSchema = new User();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendEmail = require("./../middlewares/sendEmail");
const Rewards = require("../model/rewardsModel");
const RewardLog = require("../model/rewardLogModel");
dotenv.config({ path: "./config.env" });

const signupToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
};

exports.signup = async (req, res) => {
  req.body.user_image = "avatar.png";
  req.requestTime = new Date().toISOString();
  try {
    const reward = await Rewards.find({ type: "User Signup" });
    req.body.coins = reward[0].value;
    const newUser = await User.create(req.body);
    await RewardLog.create({
      value: reward[0].value,
      title: "",
      type: "signup",
      user_id: newUser._id,
    });
    res.status(201).json({
      status: "success",
      data: {
        message: "user created successfully",
        newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  console.log("change p", req.body, req.params.id);
  try {
    const newUser = await User.findById(req.params.id);
    const newpassword = await bcrypt.hash(req.body.new_password, 12);
    console.log("new", newpassword);

    console.log("compare");
    const isMatch = await newUser.validatePassword(req.body.new_password);
    console.log("is", isMatch);
    return;

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "failed",
        message: "Current password doesnot match",
      });
    }
    await User.findByIdandUpdate(req.params.id, {
      password: req.body.new_password,
    });
    res.status(200).json({
      status: "success",
      token,
      data: {
        message: "password changed successfully",
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.teacherSignup = async (req, res) => {
  if (req.files && req.files.length > 1) {
    req.body.user_image = req.files.user_image[0].filename;
    req.body.id_photo = req.files.id_photo[0].filename;
  }
  req.requestTime = new Date().toISOString();
  req.body.user_verified = "pending";
  try {
    const reward = await Rewards.find({ type: "User Signup" });
    req.body.coins = reward[0].value;

    const newUser = await User.create(req.body);
    await RewardLog.create({
      value: reward[0].value,
      title: "",
      type: "signup",
      user_id: newUser._id,
    });

    const token = signupToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        message: "user created successfully",
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  req.requestTime = new Date().toISOString();
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(404).json({
        status: "failed",
        message: "missing required fields.",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "failed",
        message: "The credentials do not match.",
      });
    }

    const token = signupToken(user._id);

    if (req.cookies && req.cookies[user._id]) {
      req.cookies[user._id] = "";
    }

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
      request: req.requestTime,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};
exports.adminLogin = async (req, res) => {
  req.requestTime = new Date().toISOString();
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(404).json({
        status: "failed",
        message: "missing required fields.",
      });
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "failed",
        message: "The credentials do not match.",
      });
    }

    if (user.user_role === "student" || user.user_role === "teacher") {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized.",
      });
    }

    const token = signupToken(user._id);

    if (req.cookies && req.cookies[user._id]) {
      req.cookies[user._id] = "";
    }

    res.cookie(String(user._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30), // 30 seconds
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
      request: req.requestTime,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
    });
  }
};

exports.sendLink = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(401).json({ status: 401, message: "Enter Your Email" });
  }

  try {
    const userfind = await User.findOne({ email: email });
    // token generate for reset password
    const token = jwt.sign(
      { _id: userfind._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3600s",
      }
    );

    if (userfind) {
      await sendEmail(
        userfind.email,
        "Password Reset",
        `This Link is Valid For 1 hour. Please visit http://localhost:3000/resetpassword/${userfind.id}/${token}`
      );

      return res.status(200).json({
        status: "success",
        message: "Link sent to email",
      });
    }
    return res.status(400).json({
      status: "failed",
      message: "Link not sent",
    });
  } catch (err) {
    res.status(404).json({ status: 401, message: err.message });
  }
};

exports.newPassword = async (req, res) => {
  const { id, token, new_password } = req.body;
  try {
    const validuser = await User.findById(id);

    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (validuser && verifyToken) {
      const newpassword = await bcrypt.hash(new_password, 12);

      const setnewuserpass = await User.findByIdAndUpdate(
        { _id: id },
        { password: newpassword }
      );

      setnewuserpass.save();
      return res.status(200).json({
        status: "success",
        message: "Password reset successfull",
        data: {
          user: setnewuserpass,
        },
      });
    } else {
      return res.status(400).json({
        status: "failed",
        message: "Link is not valid",
      });
    }
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
};
