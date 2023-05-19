const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("./model/userModel");
const express = require("express");
const router = express.Router();
require("dotenv/config");

// passport.serializeUser((user, done) => {
//   done(null, user.google_id || user.id);
// });

// passport.deserializeUser((googleId, done) => {
//   User.findOne({ google_id: googleId }, (err, user) => {
//     done(err, user);
//   });
// });

passport.use(User.createStrategy());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log("gpoogo", profile);
      User.findOrCreate(
        {
          google_id: profile.id,
          user_image: profile.photos[0].value,
          email: profile.emails[0].value,
          full_name: profile.displayName,
        },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

module.exports = router;
