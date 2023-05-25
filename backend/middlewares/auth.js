const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    console.log("upda");
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

    const user = await User.findOne({ _id: decoded.id || decoded.user._id });
    console.log("dec", user);

    req.user_id = user._id;
    req.user_role = user.user_role;
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
