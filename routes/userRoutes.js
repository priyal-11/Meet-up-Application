const express = require('express');
const controller = require('../controllers/userController');
const {isGuest,isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn,validateResult} = require('../middlewares/validator');

const router = express.Router();

//get the signup form
router.get('/new',isGuest,controller.new);

//create the new user
router.post('/',isGuest,validateSignUp,validateResult,controller.create);

//get the login page
router.get('/login',isGuest,controller.getLogin);

//process the login request
router.post('/login',logInLimiter,isGuest,validateLogIn,validateResult,controller.postLogin)

//get user profile
router.get('/profile',isLoggedIn,controller.getProfile)

//logout the user
router.get('/logout',isLoggedIn,controller.logout)

module.exports = router;