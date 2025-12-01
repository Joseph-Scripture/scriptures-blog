const { body } = require("express-validator");

const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail();

const passwordValidator = body("password")
  .trim()
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
  .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
  .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
  .matches(/\d/).withMessage("Password must contain at least one number")
  .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)");

const nameValidator = body("username")
  .trim()
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long")
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage("Username can only contain letters, numbers, and underscores");

module.exports = { emailValidator, passwordValidator, nameValidator };
