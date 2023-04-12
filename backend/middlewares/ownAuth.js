const User = require("../model/userModel");
const Question = require("../model/questionsModel");
const jwt = require("jsonwebtoken");

const ownAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer"))
      return res.status(400).json({ message: "No token found" });

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "You are not authorized" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "You are not authorized" });
    }

    const user = await User.findOne({ _id: decoded.id });
    console.log("user", user.user_role);
    const question = await Question.findById(req.params.id);
    console.log(
      user._id.toString() !== question.user_id.toString() ||
        user.user_role !== "admin"
    );
    if (user.user_role === "admin") {
      req.user_id = user._id;
      req.user_role = user.user_role;
      return next();
    }
    if (user._id.toString() !== question.user_id.toString()) {
      return res.status(401).json({ msg: "You are not authorized" });
    }
    req.user_id = user._id;
    req.user_role = user.user_role;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = ownAuth;
