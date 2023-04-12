const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

const CLIENT_URL = "http://localhost:3000";

authRouter.get("/logins", (req, res) => {
  console.log("sucesss", req.user);
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

authRouter.get("/login/failed", (req, res) => {
  console.log("failed");
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = authRouter;
