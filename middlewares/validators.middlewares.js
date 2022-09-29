const { body, validationResult } = require("express-validator");

const checkValidations = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Mensaje de errores
    const errorMessages = errors.array().map((err) => err.msg);

    const message = errorMessages.join(". ");

    return res.status(400).json({
      status: "error",
      message,
    });
  }
  next();
};

const createUserValidators = [
  body("name").isString().notEmpty().isLength({ min: 3 }),
  body("email").isEmail(),
  body("password")
    .isString()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Minimo 8 caracteres"),
  checkValidations,
];

const createPostValidators = [
  body("title")
    .isString()
    .withMessage("Title must be a sting")
    .isLength({ min: 3 })
    .withMessage("El titulo debe ser mas largo"),
  body("content")
    .isString()
    .withMessage("El contenido debe ser sting")
    .isLength({ min: 3 })
    .withMessage("El contenido debe ser mas largo"),
  checkValidations,
];

module.exports = { createUserValidators, createPostValidators };
