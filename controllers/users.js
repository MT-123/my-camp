const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('./users/register');
};

module.exports.createUser = async (req, res, next) => {
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
        req.flash('error', err.message);
        res.redirect('/register');
    };
};

module.exports.renderLogin = (req, res) => {
    res.render('./users/login');
};

module.exports.redirectLoggedIn = (req, res) => {
    req.flash('success', `Hi ${req.body.username}, welcome back.`);
    const redirectPath = req.session.returnTo || '/campgrounds';
    // retrieve the original url
    delete req.session.returnTo;
    // delete the returnTo property
    res.redirect(redirectPath);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out. Goodbye!');
        res.redirect('/campgrounds');
    });
};
