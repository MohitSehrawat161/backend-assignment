const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const jwtSign = async (id) => {
  return await jwt.sign({ id }, process.env.SECRET);
};

exports.signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    console.log(user);
    const token = await jwtSign(user._id);
    const userObject = user.toObject();
    delete userObject.password;
    console.log(user);
    res.status(201).json({
      status: "success",
      data: userObject,
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

exports.login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password)
      return next(new appError("Please provide email and password."));
    const user = await User.findOne({ email: req.body.email }).select(
      "password email name id role createdAt"
    );
    if (
      !user ||
      !(await user.checkPassword(req.body.password, user.password))
    ) {
      return next(new appError("Email or password is incorrect", 401));
    }
    const token = await jwtSign(user._id);
    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    // console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new appError("You are not logged in please login", 401));
    }

    const decoded = await jwt.verify(token, process.env.SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new appError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(500).json({
      success: "false",
      error,
    });
  }
};

exports.restrictTo = (...authorizedRoles) => {
  return (req, res, next) => {
    let isAuthorized = false;
    req.user.role.forEach((currentUserRole) => {
      if (authorizedRoles.includes(currentUserRole)) isAuthorized = true;
    });   
    if (!isAuthorized) {
      return next(
        new appError("You do not have permission to perform this action.", 401)
      );
    }
    next();
  };
};
