const { verifyCampSchema,verifyReviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground'); // import the model


// login status check
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        // keep the original url at session to go back after login
        req.flash('error', 'Login requred!');
        return res.redirect('/login');
    }
    return next();
}

// middleware fn for data validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = verifyCampSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
}

// middleware for checking the user is the author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'not the author!');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
}

// middleware fn for review validation
module.exports.validateReview = (req, res, next) => {
    const { error } = verifyReviewSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
}