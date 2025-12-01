const {Router} = require('express');
const authController = require('../controllers/authController');
const {
    emailValidator,
    passwordValidator,
    nameValidator
} = require('../middleware/vallidation');
const vallidator = require('../middleware/vallidationHandler')


const router = Router();

router.post('/register', [emailValidator,passwordValidator,nameValidator],authController.signup);
router.post('/login',[passwordValidator], authController.login);
router.post('/logout', authController.logout);

module.exports = router