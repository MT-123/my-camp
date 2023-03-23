"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const usersRoute = require('./routes/users');
const { customField, verifyUser } = require('./utils/cryptoSQL');
const LocalStategy = require('passport-local').Strategy;
const checkDataAndSeed = require('./utils/checkDataAndSeed');
// check if there is already data in DB or seed it
// wait 10s for mySQL to setup table schemes
setTimeout(checkDataAndSeed, 10000);
const sessionConfig = {
    // for safety, some defaults have better been modified to avoid session hijack
    name: "campUser",
    secret: 'thisissecretjkl80&-df#f',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 30,
        httpOnly: true // for web safety, session is only accessible by http
    }
};
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.engine('ejs', ejsMate);
// use ejsMate instead of the default
app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
//set up path for static files at the public folder
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
//the passport.session must be after session middleware
const strategy = new LocalStategy(customField, verifyUser);
passport.use(strategy);
// save user info at session
passport.serializeUser((user, done) => {
    done(null, { id: user.id, username: user.username });
});
// add info to req.user
passport.deserializeUser((user, done) => {
    done(null, user);
});
// objects available to every page
app.use((req, res, next) => {
    // flash
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // login status
    res.locals.currentUser = req.user;
    return next();
});
// routers
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);
app.use('/', usersRoute);
// homepage
app.get('/', (req, res) => {
    res.render('home');
});
// catch the unexpected url
app.all('*', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('! request url out of routes!!! url:\n', fullUrl);
    return next(new ExpressError('No such link!', 404));
});
// catch error
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal issue :'(" } = err;
    console.log('X ERROR:\n', err);
    res.status(statusCode).render('error', { statusCode, message });
});
app.listen(port, () => {
    console.log(`V Port ${port} online :)`);
});
