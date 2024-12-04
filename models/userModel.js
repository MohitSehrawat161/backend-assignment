const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: [true, "Please tell your email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Please tell your Phone number"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    minLength: 8,
    select: false,
    required: [true, "Please provide a confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "Passwords are not same",
  },
  role: {
    type: [String],
    default: ["user"],
    enum: ["user", "admin"],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  createdAt: Date,
  updatedAt: Date,
});

userSchema.pre("save", function (next) {
  this.createdAt = new Date();
  this.updatedAt=new Date()
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  currentPassword,
  userPassword
) {
 
  return await bcrypt.compare(currentPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
