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
const querySQL = require('../utils/querySQL');
module.exports.createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const campground_id = req.params.id;
    const { body, rating } = req.body.reviews;
    const author_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    yield querySQL('INSERT INTO reviews (body, rating, author_id, campground_id) VALUES (?,?,?,?)', [body, rating, author_id, Number(campground_id)]);
    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${campground_id}`);
});
module.exports.deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, reviewId } = req.params;
    yield querySQL('DELETE FROM reviews WHERE review_id = ?', [Number(reviewId)]);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
});
