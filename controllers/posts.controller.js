const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");

const { Post } = require("../models/post.model");
const { User } = require("../models/user.model");
const { Comment } = require("../models/comment.model");
const { PostImg } = require("../models/postImg.model");

// Utils
const {
  storage,
  uploadPostImgs,
  getPostImgUrls,
} = require("../utils/firebase.util");
const { async } = require("@firebase/util");

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title", "content", "createdAt"],
      include: [
        { model: User, attributes: ["id", "name"] },
        {
          model: Comment,
          required: false, // Apply outer join
          attributes: ["id", "comment", "createdAt"],
        },
        { model: PostImg },
      ],
    });

    const postWithImgs = await getPostImgUrls(posts);

    res.status(200).json({
      status: "success",
      data: {
        posts: postWithImgs,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { sessionUser } = req;

    const newPost = await Post.create({
      title,
      content,
      userId: sessionUser.id,
    });

    await uploadPostImgs(req.files, newPost.id);

    res.status(201).json({
      status: "success",
      data: {
        newPost,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { post } = req;

    await post.update({ title, content });

    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const { post } = req;

    await post.update({ status: "deleted" });

    res.status(204).json({ status: "success" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
};
