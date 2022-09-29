const express = require("express");

const postRouter = express.Router();

// Middlewares
const { postExist } = require("../middlewares/post.middlewares");

const {
  createPostValidators,
} = require("../middlewares/validators.middlewares");

const {
  protectSession,
  protectPost,
  adminAccess,
} = require("../middlewares/auth.middlewares");

const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");

const { upload } = require("../utils/multer.util");

postRouter.use(protectSession);

postRouter.get("/", getAllPost);

// postRouter.post("/", upload.single("postImg"), createPost);

postRouter.post("/", upload.array("postImg", 3), createPost);

postRouter.patch("/:id", postExist, protectPost, updatePost);

postRouter.delete("/:id", postExist, protectPost, deletePost);

module.exports = { postRouter };
