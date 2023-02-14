const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const campController = require('../controllers/campgrounds');
const multer = require('multer');
const { cloudinary, storage } = require('../utils/cloudinary')
const upload = multer({ storage });// set up the upload folder


router.route('/')
    .get(wrapAsync(campController.renderIndex))
    // campgrounds index page
    .post(// create campgrounds
        isLoggedIn,
        upload.array('photoFile'),// upload image files and create req.files for files info
        validateCampground,
        wrapAsync(campController.createCamp))

// new campground page
router.get('/new', isLoggedIn, campController.renderNewForm);

// Update 1/2
router.get('/:id/edit', isLoggedIn, wrapAsync(campController.renderEdit));

router.route('/:id')
    .get(wrapAsync(campController.readCamp))// Read
    .put(isLoggedIn, isAuthor, validateCampground, wrapAsync(campController.updateCamp))// Update 2/2
    .delete(isLoggedIn, isAuthor, wrapAsync(campController.deleteCamp))// Delete

module.exports = router;
