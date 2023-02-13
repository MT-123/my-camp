const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campController = require('../controllers/campgrounds');


// campgrounds index page
router.get('/', wrapAsync(campController.renderIndex));

// new campground page
router.get('/new', isLoggedIn, campController.renderNewForm);

// create
router.post('/', isLoggedIn, validateCampground, wrapAsync(campController.createCamp));

// Read
router.get('/:id', wrapAsync(campController.readCamp));


// Update 1/2
router.get('/:id/edit', isLoggedIn, wrapAsync(campController.renderEdit));

// Update 2/2
router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(campController.updateCamp));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campController.deleteCamp));

module.exports = router;
