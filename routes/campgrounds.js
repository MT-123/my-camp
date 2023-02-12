const express = require('express');
const router = express.Router();
const Campground = require('../models/campground'); // import the model
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { verifyCampSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const isLoggedIn = require('../isLoggedIn');

// middleware fn for data validation
const validateCampground = (req, res, next) => {
    const { error } = verifyCampSchema.validate(req.body);
    if (error) { return next(new ExpressError(error.details.map(arr => arr.message), 400)) };
    return next();
}

// campgrounds index page
router.get('/', wrapAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('./campgrounds/index', { camps });
}));

// new campground page
router.get('/new', isLoggedIn, (req, res) => {
    console.log(req)
    res.render('./campgrounds/new');
});

// create
router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
    const { campground } = req.body;
    const author = req.user._id; // req.user is created by passport after login done
    const newCamp = new Campground(campground);
    newCamp.author = author;
    await newCamp.save();
    req.flash('success', 'A new campground added!');// push a flash message
    res.redirect(`/campgrounds/${newCamp.id}`);
}));

// Read
router.get('/:id', wrapAsync(async (req, res, next) => {
    // name the url with hierarchy structure(home/index/element)
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews').populate('author','username');
    // only populate the author.username for user private protection
    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }
    res.render('./campgrounds/show', { camp });
}));


// Update 1/2
router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', { camp })
}));

// Update 2/2
router.put('/:id', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const camp = await Campground.findById(id).populate('author');
    if (camp.author.equals(req.user)){
        await Campground.findByIdAndUpdate(id, campground);
        req.flash('success', 'The campground updated!');
        return res.redirect(`/campgrounds/${id}`);
    }
    req.flash('error', 'not the author!');
    return res.redirect(`/campgrounds/${id}`);
}));

// Delete
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', `The campground ${camp.title} deleted!`);
    res.redirect('/campgrounds');
}));

module.exports = router;
