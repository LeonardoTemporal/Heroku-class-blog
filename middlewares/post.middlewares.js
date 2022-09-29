const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { catchAsync } = require("../utils/catchAsync.util");

const postExist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
      include: { model: User },
    });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not fund",
      });
    }
    req.post = post;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postExist };
