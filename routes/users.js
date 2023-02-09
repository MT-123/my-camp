const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('./users/register');
})

router.post('/register', wrapAsync(async (req, res) => {
    const { user } = req.body;
    const newUser = new User(user);
    try {
        await User.register(newUser, user.password);
        // register argument is (user data[mongoose document],password[string])
        req.flash('success', 'Welcome, registration completed!');
        res.redirect('/campgrounds');
    } catch (e) {
        // if the register fails(ex. username has been used), send the error message 
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('./users/login');
})

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    // this middleware will find req.body.username and req.body.passsword by default
    (req, res) => {
        req.flash('success', `Hi ${req.body.username}, welcome back.`);
        res.redirect('/campgrounds');
    })

module.exports = router;
