"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router({ mergeParams: true }); // make the whole url available to this file(for access to params :id)
const wrapAsync = require('../utils/wrapAsync'); // to catch error from the async fn
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');
const reviewController = require('../controllers/reviews');
// post a review
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// delete a review
router.delete('/:reviewId', isReviewAuthor, wrapAsync(reviewController.deleteReview));
module.exports = router;
