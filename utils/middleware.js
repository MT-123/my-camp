"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { verifyCampSchema, verifyReviewSchema } = require('./joiSchemas');
const ExpressError = require('./ExpressError');
const querySQL = require('./querySQL');
// login status check
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = (req.method === 'GET' ? req.originalUrl : `/campgrounds/${req.params.id}`);
        // keep the original url at session to go back after login
        // only keep the GET request cause the redirect is GET request
        req.flash('error', 'Login requred!');
        return res.redirect('/login');
    }
    return next();
};
// middleware fn for data validation
module.exports.validateCampground = (req, res, next) => {
    const { error } = verifyCampSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(error.details.map((arr) => arr.message), 400));
    }
    ;
    return next();
};
// middleware for checking the user is the author
module.exports.isAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const results = yield querySQL('SELECT * FROM campgrounds WHERE campground_id = ?', [id]);
    // await Campground.findById(id);
    if (results[0].author_id !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        req.flash('error', 'Not the author!');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
});
module.exports.isReviewAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id, reviewId } = req.params;
    const results = yield querySQL('SELECT * FROM reviews WHERE review_id = ?', [Number(reviewId)]);
    // await Review.findById(reviewId);
    if (results[0].author_id !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
        // not logged in(req.user will be undefined) or not the review author will be true
        req.flash('error', 'Not this review author!');
        return res.redirect(`/campgrounds/${id}`);
    }
    return next();
});
// middleware fn for review validation
module.exports.validateReview = (req, res, next) => {
    const { error } = verifyReviewSchema.validate(req.body);
    if (error) {
        return next(new ExpressError(error.details.map((arr) => arr.message), 400));
    }
    ;
    return next();
};
//# sourceMappingURL=middleware.js.map