const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const jwtSign = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET);
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await jwtSign(user._id);
    res.status(201).json({
      status: "success",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.login = async (req, res,next) => {
  try {
    if(!req.body.email || !req.body.password) return next(new appError('Please provide email and password.'))
    const user = await User.findOne({ email: req.body.email }).select('password');
    if(!user || !(await user.checkPassword(req.body.password,user.password))){
      return next(new appError('Email or password is incorrect',401))
    }
    const token=await jwtSign(user._id)
    res.status(200).json({
      status:'success',
      token
    })
    
    // console.log(user);
  } catch (error) {
    console.log(error)
    res.status(500).json({});
  }
};
