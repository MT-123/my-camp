const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        // keep the original url at session to go back after login
        req.flash('error', 'Login requred!');
        return res.redirect('/login');
    }
    return next();
}

module.exports = isLoggedIn;
