const querySQL = require('../utils/querySQL');
import { Request, Response } from "express";


module.exports.createReview=async (req: Request, res: Response) => {
    const campground_id = req.params.id;
    const {body,rating} = req.body.reviews;
    const author_id = req.user?.id;

    await querySQL('INSERT INTO reviews (body, rating, author_id, campground_id) VALUES (?,?,?,?)',
    [body,rating,author_id,Number(campground_id)]);

    req.flash('success', 'Review posted');
    res.redirect(`/campgrounds/${campground_id}`);
};

module.exports.deleteReview = async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    await querySQL('DELETE FROM reviews WHERE review_id = ?', [Number(reviewId)]);

    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
};

export {};
