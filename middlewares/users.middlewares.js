const { User } = require("../models/user.model");

// Utils
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if the user exist befire update
  const user = await User.findOne({
    attributes: { exclude: "password" },
    where: { id },
  });
  // if user doesn't exist, send error message
  if (!user) {
    return next(new AppError("User not found", 400));
  }
  req.user = user;
  next();
});

module.exports = { userExist };
