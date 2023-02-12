const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStategy = require('passport-local');
const User = require('./models/user');
const usersRoute = require('./routes/users');

const sessionConfig = {
    secret: 'temporary',
    resave: false, // to suppress warning
    saveUninitialized: true, // to suppress warning
    cookie: { // setup cookies
        maxAge: 1000 * 60 * 30,//expire in 30 min
        httpOnly: true // for web safety
    }
}

mongoose.set('strictQuery', true); // to supress mongoose warning
mongoose.connect('mongodb://localhost:27017/my-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'X database connection error:'));
db.once('open', () => {
    console.log('V Database connected :)');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate);
// use ejsMate instead of the default

app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
//set up path for static files at the public folder
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//the passport.session must be after session middleware
passport.use(new localStategy(User.authenticate()));
// use local authentication with user model

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//to store and remove the sessions of logged users


// log request for a campground
app.use('/campgrounds/:id', (req, res, next) => {
    // middleware for url with "/campgrounds/" by any methods
    console.log('! id: ', req.params.id, ' accessing!')
    return next();
    // use "return" instead of just "next()"" to make sure this middleware ends here
});

// objects access to every page
app.use((req, res, next) => {
    // flash
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // login status
    res.locals.currentUser = req.user;
    return next();
})


// routers
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);
app.use('/',usersRoute);

// homepage
app.get('/', (req, res) => {
    res.render('home');
})

// catch the unexpected url
app.all('*', (req, res, next) => {
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('! request url out of routes!!! url:\n', fullUrl)
    return next(new ExpressError('No such link!', 404));
})

// catch error
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal issue :'(" } = err;
    console.log('X ERROR:\n', err);
    res.status(statusCode).render('error', { statusCode, message })
})

app.listen(8080, () => {
    console.log('V Port 8080 online :)');
});
