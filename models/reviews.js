const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body : String,
    likes : Number
});

module.exports = mongoose.model('Review',reviewSchema);
