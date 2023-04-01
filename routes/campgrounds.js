"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middleware');
const campController = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage }); // set up the upload folder
router.route('/')
    .get(wrapAsync(campController.renderIndex))
    // campgrounds index page
    .post(// create campgrounds
isLoggedIn, upload.array('photoFile', 5), // upload image files and create req.files for files info
validateCampground, wrapAsync(campController.createCamp));
// user camp index
router.get('/usercamp', isLoggedIn, wrapAsync(campController.renderUserIndex));
// new campground page
router.get('/new', isLoggedIn, campController.renderNewForm);
// Update 1/2
router.get('/:id/edit', isLoggedIn, wrapAsync(campController.renderEdit));
router.route('/:id')
    .get(wrapAsync(campController.readCamp)) // Read
    .put(isLoggedIn, isAuthor, upload.array('photoFile', 5), validateCampground, wrapAsync(campController.updateCamp)) // Update 2/2
    .delete(isLoggedIn, isAuthor, wrapAsync(campController.deleteCamp)); // Delete
module.exports = router;
