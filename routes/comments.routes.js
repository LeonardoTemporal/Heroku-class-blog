const express = require("express");

// Controllers
const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments.controller");

// Middlewares
const { commentExists } = require("../middlewares/comments.middlewares");
const {
  protectSession,
  protectComments,
} = require("../middlewares/auth.middlewares");

const commentsRouter = express.Router();

commentsRouter.use(protectSession);

commentsRouter.get("/", getAllComments);

commentsRouter.post("/", createComment);

commentsRouter.patch("/:id", commentExists, protectComments, updateComment);

commentsRouter.delete("/:id", commentExists, protectComments, deleteComment);

module.exports = { commentsRouter };
