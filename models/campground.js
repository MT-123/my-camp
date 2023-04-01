const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const ImgSchema = new Schema({
        filename: String,
        url: String,
});

ImgSchema.virtual('thumbnail').get(function () {
    // create virtual property "thumbnail" on object camp.cloudImg[i]
    return this.url.replace('/upload/','/upload/c_fit,h_250,w_250/')
    // get the resized image by fit mode, heigh:250px; width: 250px
});
// camp.cloudImg[i].thumbnail will return the edited url for getting thumbnail image

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    cloudImg: [ImgSchema],
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

// findByIdAndDelete() in the app.js will trigger findOneAndDelete() which is supported by post middleware
// middleware post is OK(instead of pre) because the deleted document is passed to doc

module.exports = mongoose.model('Campground', CampgroundSchema);
