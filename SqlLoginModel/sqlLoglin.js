if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
//new
const LocalStategy = require('passport-local').Strategy;
const mysql = require('mysql');
const crypto = require('crypto');// node built-in
// const MySQLStore = require('express-mysql-session')(session);

// const dbPath = process.env.DBPATH||'mongodb://localhost:27017/my-camp';
// const mongoose = require('mongoose');
// const ExpressError = require('./utils/ExpressError');
// const campgroundsRoute = require('./routes/campgrounds');
// const reviewsRoute = require('./routes/reviews');
// const flash = require('connect-flash');
// const localStategy = require('passport-local');
// const User = require('./models/user');
// const usersRoute = require('./routes/users');
// const helmet = require("helmet");
// const {contentSecurityPolicy, crossOriginEmbedderPolicy} = require('./utils/helmetConfig');
// const { strategies } = require('passport');
// const mongoSanitize = require('express-mongo-sanitize');

const sessionConfig = {
    // for safety, some defaults have better been modified to avoid session hijack
    // key: 'session_cookie_name',
    name: "campUser",// cookie name, default is "connect.sid" if not specified
    secret: 'thisissecretjkl80&-df#f',// string for computing hash, it should be random
    resave: false, // not resaving session if no modified, for reducing server loading
    saveUninitialized: true, // to suppress warning
    cookie: { // setup cookies
        maxAge: 1000 * 60 * 30,// expire in 30 min
        httpOnly: true // for web safety, session is only accessible by http
    },
    // store: new MySQLStore({
    //     host:'localhost',
    //     port: 3306,
    //     user: 'root',
    //     database: 'cookie_user',
    // })
};



// mongoose.set('strictQuery', true); // to supress mongoose warning
// mongoose.connect(dbPath);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'X database connection error:'));
// db.once('open', () => {
//     console.log('V Database connected :)');
// });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate);
// use ejsMate instead of the default

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
//set up path for static files at the public folder
app.use(session(sessionConfig));
// app.use(flash());

// app.use(helmet()); // make restriction for web security
// app.use(contentSecurityPolicy);// set the access to the specified outer resouces
// app.use(crossOriginEmbedderPolicy);// set the cross origin policy



// app.use(mongoSanitize());// to prevent mongo injection

app.use(passport.initialize());
app.use(passport.session());
//the passport.session must be after session middleware
// passport.use(new localStategy(User.authenticate()));
// use local authentication with user model

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//to store and remove the sessions of logged users

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'paulsql101',
    database: 'user',
    multipleStatements: false, // prevent SQL injection
});

connection.connect((err) => {
    if (err) {
        console.log('X sqlDB connection failed!!!');
        throw err;
    };
    console.log('V sql DB connected')
})

const customField = {
    usernameField: 'username',
    passwordField: 'password',
};

const pbkdf2Config = {
    iterations: 10000,
    keylen: 32,
    digest: 'sha256',
    saltSize: 32,
}

function verifyUser(username, password, cb) {
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results, fields) => {
        if (err) { return cb(err); }
        if (results.length == 0) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        //verify password
        crypto.pbkdf2(
            password,
            results[0].salt,
            pbkdf2Config.iterations,
            pbkdf2Config.keylen,
            pbkdf2Config.digest,
            (err, hashedPassword) => {
                if (err) { return cb(err); }
                if (!crypto.timingSafeEqual(Buffer.from(results[0].hash, 'hex'), hashedPassword)) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
                const username = results[0].username;
                const id = results[0].id;
                const food = results[0].food;
                return cb(null, { username, id, food});
            });
    });
}

// function verifyCallback(username, password, done) {
//     console.log('inside verifyCallback');
//     connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results, fields) => {
//         console.log('inside query');
//         if (err) { return done(err) }; // error happened
//         if (results.length == 0) {// username not found
//             return done(
//                 null,
//                 false,
//                 {
//                     message: 'Incorrect username or password.'
//                 })
//         };
//         const isValid = validPassword(password, results[0].hash, results[0].salt); // verify password
//         const user = {
//             id: results[0].id,
//             username: results[0].username,
//         };
//         if (isValid) {
//             return done(null, user);
//         } else {// incorrect password
//             return done(null, false, { message: 'Incorrect username or password.' });
//         };
//     })
// }
// function validPassword(password, hash, salt) {
//     const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex');
//     return (hash === hashVerify);
// }

const strategy = new LocalStategy(customField, verifyUser);
passport.use(strategy);


// save user info at session
passport.serializeUser((user, done) => {
    console.log('in the serialize');
    done(null, { id: user.id, username: user.username, food: user.food});
});

// add info to req.user
passport.deserializeUser((user, done) => {
    console.log('in the deserialize, id:', user.id);
    done(null, user);
});



function genPassword(password) {
    const salt = crypto.randomBytes(pbkdf2Config.saltSize).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, pbkdf2Config.iterations, pbkdf2Config.keylen, pbkdf2Config.digest).toString('hex');
    return { salt, hash };
}

function isAuth(req, res, next) {
    if (!req.isAuthenticated()) {return res.redirect('/login')};
    return next();
}

function userDuplicate(req, res, next) {
    const { username } = req.body.user;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results, fields) => {
        if (err) { return next(err) };
        if (results.length) { return res.render('./users/userExists')};
        return next();
    });
};

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/register',(req,res)=>{
    res.render('./users/register');
})

app.get('/login',(req,res)=>{
    res.render('./users/login');
})

app.get('/logout',(req,res)=>{
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

app.get('/secret', isAuth, (req,res)=>{
    res.render('./users/secret', {username: req.user.food});
});


app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true  ,keepSessionInfo: true}),
  (req, res)=> {res.render('./users/welcome',{username: req.user.username});}
  );

app.post('/register',userDuplicate,(req,res)=>{
    const {username, password, email}=req.body.user;
    const {salt,hash} = genPassword(password);
    connection.query('INSERT INTO users (username, salt, hash, email) VALUES(?,?,?,?);',[username, salt, hash, email],(err,results,fields)=>{
        if (err){console.log(err);throw err};
        return res.redirect('/login')
    })
})


app.listen(port, () => {
    console.log(`V Port ${port} online :)`);
});

