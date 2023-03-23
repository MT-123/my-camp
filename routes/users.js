"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const userController = require('../controllers/users');
const { userDuplicate } = require('../utils/cryptoSQL');
router.route('/register')
    .get(userController.renderRegister) // render register page
    .post(userDuplicate, wrapAsync(userController.createUser)); // register user
router.route('/login')
    .get(userController.renderLogin) // render login page
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, keepSessionInfo: true }), 
// this middleware will find req.body.username and req.body.passsword by default
// keepSessionInfo must set to true to avoid req.session.returnTo being cleared
userController.redirectLoggedIn); // login authentication
// logout
router.get('/logout', userController.logout);
module.exports = router;
//# sourceMappingURL=users.js.map