const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models/user.model");
const { Post } = require("../models/post.model");
const { Comment } = require("../models/comment.model");

dotenv.config({ path: "./config.env" });

const getAllUsers = async (req, res) => {
  try {
    // grant access

    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      where: { status: "active" },
      include: [
        { model: Post, include: { model: Comment, include: { model: User } } },
        { model: Comment },
      ],
    });

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role !== "admin" && role !== "normal") {
      return res.status(400).json({
        status: "error :(",
      });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    // remove password from resoponse
    newUser.password = undefined;

    // 201 -> Success and a resource has been created
    res.status(201).json({
      status: "success",
      data: { newUser },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name } = req.body;
    const { user } = req;

    await user.update({ name });

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exist before deletion
    const user = await User.findOne({ where: { id } });

    // If user doesn't exist, send error message
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not fund",
      });
    }

    // If user exist, remove it from db

    //Method 1: Delete by using the model
    // User.destroy({where: { id }})

    // Method 2: Delete by using the model's instance
    // await user.destroy();

    // Method 3: Soft delete (recommended)
    await user.update({ status: "deleted" });

    res.status(204).json({
      status: "success",
      data: { user },
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    // get emal and passgord from req.body
    const { email, password } = req.body;

    // Validate if the user exist with given email
    const user = await User.findOne({
      where: { email, status: "active" },
    });

    //if user or password dosent exist, send error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        status: "error",
        message: "Wrong credentials",
      });
    }

    // compare passwords (entered pass vs db pass)
    // const isPasswordValid = await bcrypt.compare(password, user.password);

    //hide passworf from response
    user.password = undefined;

    // Generate jsonwebtoken
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      status: "success",
      data: { user, token },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
};
