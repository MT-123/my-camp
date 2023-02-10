const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Login requred!');
        return res.redirect('/login');
    }
    return next();
}

module.exports = isLoggedIn;
