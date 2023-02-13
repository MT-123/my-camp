const Campground = require('../models/campground'); // import the model
const Review = require('../models/reviews');

module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const newReview = new Review(req.body.reviews);
    const camp = await Campground.findById(id);
    newReview.author = req.user._id;
    camp.reviews.push(newReview);
    await camp.save();
    await newReview.save();
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // remove the id matched review from the reviews array 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}
