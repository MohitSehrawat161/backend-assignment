const User = require("../models/userModel");
const appError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");
exports.getAllUsers = async (req, res) => {
  try {
    const features = new ApiFeatures(User.find(), req.query)
      .paginate()
      .sort()
      .filter()
      .search();
    const users = await features.query;

    res.status(200).json({
      status: "success",
      data: users,
      pageSize: users.length,
      pageNumber: req.query.pageNumber || 1,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "fail",
      error,
    });
  }
};

exports.deactivateUser = async (req, res, next) => {
  try {
    const users = await User.findByIdAndUpdate(req.params.id, {
      active: false,
    });
    console.log(users, "deleted");
    if (!users) return next(new appError("This user does not exist", 404));
    res.status(200).json({
      status: "success",
      message: "user deactivated successfull",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Fail",
      message: "somethig went wrong",
      error,
    });
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    const fieldsToUpdate = Object.keys(req.body);
  if (!fieldsToUpdate.length)
    return next(new appError("Please enter any field to update!", 400));

  const allowedFields = ["name", "email", "phone"];

  let flag = false;
  fieldsToUpdate.forEach((key) => {
    if (!allowedFields.includes(key)) {
      flag = true;
    }
  });
  if (flag) {
    return next(
      new appError("You can only update name, email and phone number", 401)
    );
  }
  const filteredObj = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    updatedAt: new Date(),
  };
console.log(req.user.email)
  const user = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
  
  });
  console.log(user);
  res.status(200).json({
    status: "success",
    message: "Profile Updated successfull",
    data: user,
  });
  } catch (error) {
    
    res.status(500).json({
      status: "fail",
      message:"User with this email already exists."
    });
  }
  
};

exports.deleteMe = async (req, res, next) => {
  console.log(req.body);

  const user = await User.findByIdAndDelete(req.user.id);
  res.status(200).json({
    status: "success",
    message: "Account Deleted successfull",
  });
};
