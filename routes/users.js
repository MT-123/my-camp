const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { authenticate } = require('../models/user');

// register page
router.get('/register', (req, res) => {
    res.render('./users/register');
})

// register user
router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { user } = req.body;
        const newUser = new User(user);
        const registerUser = await User.register(newUser, user.password);
        // register argument is (user data[mongoose document],password[string])
        req.login(registerUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'Welcome, registration completed!');
            res.redirect('/campgrounds');
            // cause the login takes time, the redirect has to be inside this callback fn 
            // otherwise, the req.user will not be existing during redircting
        });
    } catch (err) {
        // if the register fails(ex. username has been used), send the err message 
        req.flash('err', err.message);
        res.redirect('/register');
    }
}))

// login page
router.get('/login', (req, res) => {
    res.render('./users/login');
})

// login authenticate
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true , keepSessionInfo: true}),
    // this middleware will find req.body.username and req.body.passsword by default
    // keepSessionInfo must set to true to avoid req.session.returnTo being cleared
    (req, res) => {
        req.flash('success', `Hi ${req.body.username}, welcome back.`);
        const redirectPath = req.session.returnTo || '/campgrounds';
        // retrieve the original url
        delete req.session.returnTo;
        // delete the returnTo property
        res.redirect(redirectPath);
    })

// logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out. Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports = router;
