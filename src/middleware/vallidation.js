const { body } = require("express-validator");

const emailValidator = body("email")
  .trim()
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail();

const passwordValidator = body("password")
  .trim()
  .matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .withMessage(
    "Password must be minimum 8 characters, include uppercase, lowercase, number, and special character"
  );

const nameValidator = body("username")
  .trim()
  .isLength({ min: 2 })
  .withMessage("Name must be at least 2 characters long");

module.exports = {
  emailValidator,
  passwordValidator,
  nameValidator
};
