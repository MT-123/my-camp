const express = require('express');
const router = express.Router({ mergeParams: true });// make the whole url available to this file(for access to params :id)
const Campground = require('../models/campground'); // import the model
const Review = require('../models/reviews');
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// post a review
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.reviews);
    const camp = await Campground.findById(id);
    newReview.author = req.user._id;
    camp.reviews.push(newReview);
    await camp.save();
    await newReview.save();
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${id}`);
}))


// delete a review
router.delete('/:reviewId', isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // remove the id matched review from the reviews array 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
