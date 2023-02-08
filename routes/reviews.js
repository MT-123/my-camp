const express = require('express');
const router = express.Router({mergeParams:true});// make the whole url available to this file(for access to params :id)
const Campground = require('../models/campground'); // import the model
const Review = require('../models/reviews');
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { verifyReviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

// middleware fn for data validation
const validateReview = (req, res, next) => {
    const { error } = verifyReviewSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
}

// post a review
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.reviews);
    const camp = await Campground.findById(id);
    camp.reviews.push(newReview);
    await camp.save();
    await newReview.save();
    res.redirect(`/campgrounds/${id}`);
}))

// delete a review
router.delete('/:reviewId',wrapAsync(async (req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    // remove the id matched review from the reviews array 
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
