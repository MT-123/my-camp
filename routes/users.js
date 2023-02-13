const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { authenticate } = require('../models/user');
const userController = require('../controllers/users')

// register page
router.get('/register', userController.renderRegister);

// register user
router.post('/register', wrapAsync(userController.createUser))

// login page
router.get('/login', userController.renderLogin)

// login authenticate
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true ,keepSessionInfo: true}),
    // this middleware will find req.body.username and req.body.passsword by default
    // keepSessionInfo must set to true to avoid req.session.returnTo being cleared
    userController.redirectLoggedIn
    )

// logout
router.get('/logout', userController.logout)

module.exports = router;
