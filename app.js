//? Import express
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { globalErrorHandler } = require("./controllers/error.controller");

// Routes
const { usersRouter } = require("./routes/users.routes");
const { postRouter } = require("./routes/posts.routes");
const { commentsRouter } = require("./routes/comments.routes");

const app = express();

// Enable express app to receive JSON data
app.use(express.json()); //? Middleware

// Add security headders
app.use(helmet());

// Compress responses
app.use(compression());

//
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combined"));

// user endpoints
app.use("/users", usersRouter);
// post endpoints
app.use("/posts", postRouter);
// coments endpoints
app.use("/comments", commentsRouter);

// Global error handler
app.use(globalErrorHandler);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "Error",
    message: `${req.method} ${req.url} does not exist in our server`,
  });
});

module.exports = { app };
