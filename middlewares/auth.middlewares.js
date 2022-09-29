const { User } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync.util");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const protectSession = catchAsync(async (req, res, next) => {
  // get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // extract token
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(403).json({
      status: "error",
      message: "invalid sesion",
    });
  }
  // verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // verify the  token owner\
  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  });

  if (!user) {
    return res.status(403).json({
      status: "error",
      message: "The owner of the session is not longer active",
    });
  }
  req.sessionUser = user;
  next();
});

// create a middleware to protect the users accounts
// check te sessionUser to compare to the one that wants to be updated/deleted
// if the users (id) don't match sebd an error, otherwise continue
const protectUserAccount = async (req, res, next) => {
  try {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
      return res.status(403).json({
        status: "error",
        message: "Not access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const protectPost = (req, res, next) => {
  const { sessionUser, post } = req;

  if (sessionUser.id !== post.userId) {
    return res.status(403).json({
      status: "error",
      message: "Not access",
    });
  }
  next();
};

const protectComments = (req, res, next) => {
  const { sessionUser, comment } = req;

  if (sessionUser.id !== comment.userId) {
    return res.status(403).json({
      status: "error",
      message: "Not access",
    });
  }
  next();
};

const adminAccess = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Needed admin level",
    });
  }
  next();
};

module.exports = {
  protectSession,
  protectUserAccount,
  protectPost,
  protectComments,
  adminAccess,
};
