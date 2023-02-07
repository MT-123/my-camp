const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

// findByIdAndDelete() in the app.js will trigger findOneAndDelete() which is supported by post middleware
// middleware post is OK(instead of pre) because the deleted document is passed to doc

module.exports = mongoose.model('Campground', CampgroundSchema);
