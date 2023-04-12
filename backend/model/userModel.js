const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Questions = require("./questionsModel");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    google_id: {
      type: String,
    },
    display_name: {
      type: String,
    },
    coins: {
      type: Number,
      default: 0,
    },
    user_image: {
      type: String,
    },
    id_photo: {
      type: String,
    },
    address: {
      type: String,
    },
    birth_date: {
      type: Date,
    },
    qualification: {
      type: String,
    },
    experience: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "email field is reqired"],
      unique: true,
      lowercase: true,
      validator: [validator.isEmail, "invalid email"],
    },
    user_role: {
      type: String,
      default: "student",
      enum: {
        values: ["student", "teacher", "admin", "superAdmin"],
        message: "Invalid type used",
      },
    },
    bio: {
      type: String,
    },
    phone_number: {
      type: Number,
    },
    user_blocked: {
      type: Boolean,
      default: false,
    },
    user_reported: [],
    user_verified: {
      type: String,
      default: "negative",
      enum: {
        values: ["negative", "positive", "pending"],
        message: "Invalid type used",
      },
    },
    recieve_notifications: {
      type: Boolean,
      default: false,
    },
    verified_by: {
      type: String,
    },
    password: {
      type: String,
      // required: [true, "password field is reqired"],
      minLength: [8, "Password must be of atleast 8 characters"],
      maxLength: [16, "Password must not be more than 16 characters"],
      select: false,
    },
    otp_key: {
      type: String,
      default: "",
    },
    reset_count: {
      type: Number,
      default: 0,
    },
    last_reset_time: {
      type: Date,
      default: Date.now(),
    },
    user_banned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  // capitalize
  this.full_name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");

  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    return next(error);
  }

  next();
});

userSchema.methods.correctPassword = async function validatePassword(data) {
  console.log("fsadssa", data, this.password);
  return bcrypt.compare(data, this.password);
};

userSchema.methods.getValue = function (c) {
  return c;
};

// userSchema.virtual("fullName").get(function () {
//   return `${this.first_name} ${this.last_name}`;
// });
// userSchema.virtual("avatar").get(function () {
//   return `http://localhost:5000/static/users/${this.user_image}`;
// });

userSchema.virtual("questionsAsked", {
  ref: "questions",
  foreignField: "user_id",
  localField: "_id",
});

userSchema.virtual("questionsAnswered", {
  ref: "answers",
  foreignField: "user_id",
  localField: "_id",
});

const User = mongoose.model("users", userSchema);

module.exports = User;
