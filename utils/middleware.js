const { verifyCampSchema,verifyReviewSchema } = require('./joiSchemas');
const ExpressError = require('./ExpressError');
const querySQL = require('./querySQL');

// login status check
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = (req.method==='GET' ? req.originalUrl : `/campgrounds/${req.params.id}`);
        // keep the original url at session to go back after login
        // only keep the GET request cause the redirect is GET request
        req.flash('error', 'Login requred!');
        return res.redirect('/login');
    }
    return next();
};

// middleware fn for data validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = verifyCampSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
};

// middleware for checking the user is the author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const results = await querySQL('SELECT * FROM campgrounds WHERE campground_id = ?',[id])
    // await Campground.findById(id);
    if (results[0].author_id !== req.user.id) {
        req.flash('error', 'Not the author!');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    const { id , reviewId } = req.params;
    const results = await querySQL('SELECT * FROM reviews WHERE review_id = ?',[Number(reviewId)]);
    // await Review.findById(reviewId);
    if (results[0].author_id !== req.user?.id){
        // not logged in(req.user will be undefined) or not the review author will be true
        req.flash('error', 'Not this review author!');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
};

// middleware fn for review validation
module.exports.validateReview = (req, res, next) => {
    const { error } = verifyReviewSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
};
