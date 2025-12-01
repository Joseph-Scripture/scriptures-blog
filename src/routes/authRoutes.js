const { Router } = require("express");
const authController = require("../controllers/authController");
const {
  emailValidator,
  passwordValidator,
  nameValidator,
} = require("../middleware/validation");
const validationHandler = require("../middleware/validationHandler");

const router = Router();

// REGISTER
router.post(
  "/register",
  [
    emailValidator,
    passwordValidator,
    nameValidator
  ],
  validationHandler,
  authController.signup
);

// LOGIN
router.post(
  "/login",
  [
    emailValidator,
    passwordValidator
  ],
  validationHandler,
  authController.login
);

// LOGOUT
router.post("/logout", authController.logout);

module.exports = router;
