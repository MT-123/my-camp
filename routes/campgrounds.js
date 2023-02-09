const express = require('express');
const router = express.Router();
const Campground = require('../models/campground'); // import the model
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { verifyCampSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');

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
router.get('/new', (req, res) => {
    res.render('./campgrounds/new');
});

// create
router.post('/', validateCampground, wrapAsync(async (req, res, next) => {
    const { campground } = req.body;
    const newCamp = new Campground(campground);
    // the above line is equal to followings
    // const newCamp = new Campground({
    //         title: campground.title,
    //         price: campground.price,
    //         description: campground.description,
    //         location: campground.location,
    //     });
    // because campground is like this { title: 'newtitle', price: '33', description: 'addnew', location: 'uk' }
    await newCamp.save();
    req.flash('success', 'A new campground added!');// push a flash message
    res.redirect(`/campgrounds/${newCamp.id}`);
}));

// Read
router.get('/:id', wrapAsync(async (req, res, next) => {
    // name the url with hierarchy structure(home/index/element)
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if (!camp) {
        req.flash('error', 'no such campground!');
        res.redirect('/campgrounds');
    }
    res.render('./campgrounds/show', { camp });
}));


// Update 1/2
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'no such campground!');
        res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', { camp })
}));

// Update 2/2
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    await Campground.findByIdAndUpdate(id, campground);
    req.flash('success', 'The campground updated!');
    res.redirect(`/campgrounds/${id}`);
}));

// Delete
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', `The campground ${camp.title} deleted!`);
    res.redirect('/campgrounds');
}));

module.exports = router;
