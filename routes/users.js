const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { authenticate } = require('../models/user');
const userController = require('../controllers/users')


router.route('/register')
    .get(userController.renderRegister)// render register page
    .post(wrapAsync(userController.createUser))// register user

router.route('/login')
    .get(userController.renderLogin)// render login page
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true ,keepSessionInfo: true}),
    // this middleware will find req.body.username and req.body.passsword by default
    // keepSessionInfo must set to true to avoid req.session.returnTo being cleared
    userController.redirectLoggedIn)// login authentication

// logout
router.get('/logout', userController.logout)

module.exports = router;
