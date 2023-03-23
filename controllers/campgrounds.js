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
const { cloudinary } = require('../utils/cloudinary');
module.exports.renderIndex = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultsCamp = yield querySQL("\
    SELECT campgrounds.*, images.url \
    FROM campgrounds LEFT JOIN images \
    ON images.image_id= \
    (SELECT image_id FROM images \
        WHERE images.campground_id = campgrounds.campground_id \
        LIMIT 1)\
        ");
    const camps = resultsCamp.map((camp) => {
        const _id = camp.campground_id;
        const title = camp.title;
        const price = camp.price;
        const description = camp.description;
        const location = camp.location;
        const cloudImg = [{ url: camp.url }];
        return { _id, title, price, description, location, cloudImg };
    });
    res.render('./campgrounds/index', { camps });
});
module.exports.renderNewForm = (req, res) => {
    res.render('./campgrounds/new');
};
module.exports.createCamp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, price, location, description } = req.body.campground;
    const author_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // req.user is created by passport after login done
    const resultsCamp = yield querySQL('INSERT INTO campgrounds \
    (title, price, location, description, author_id) VALUES (?,?,?,?,?)', [title, price, location, description, author_id]);
    const imgValues = req.files.map((arr) => ([arr.filename, arr.path, resultsCamp.insertId]));
    // req.files is added after upload.array() middleware
    if (imgValues.length > 0) {
        yield querySQL('INSERT INTO images \
    (filename, url, campground_id) VALUES ?', [imgValues]);
    }
    ;
    // insertId is the primary key of the inserted row
    req.flash('success', 'A new campground added!'); // push a flash message
    res.redirect(`/campgrounds/${resultsCamp.insertId}`);
});
module.exports.readCamp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const resultsCamp = yield querySQL('SELECT * FROM campgrounds WHERE campground_id = ?', [Number(id)]);
    const camps = yield composeCamps(resultsCamp);
    const camp = camps[0];
    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }
    res.render('./campgrounds/show', { camp });
});
module.exports.renderEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const resultsCamp = yield querySQL('SELECT * FROM campgrounds WHERE campground_id = ?', [Number(id)]);
    const camps = yield composeCamps(resultsCamp);
    const camp = camps[0];
    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }
    res.render('./campgrounds/edit', { camp });
});
module.exports.updateCamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campground_id = req.params.id;
    const { title, price, location, description } = req.body.campground;
    const { deleteImg } = req.body;
    yield querySQL('UPDATE campgrounds \
    SET title =?, price=?, location=?, description=? \
    WHERE campground_id = ?', [title, price, location, description, Number(campground_id)]);
    const imgValues = req.files.map((arr) => ([arr.filename, arr.path, campground_id]));
    if (imgValues.length > 0) {
        yield querySQL('INSERT INTO images \
        (filename, url, campground_id) VALUES ?', [imgValues]);
    }
    ;
    if (deleteImg) { // if not images checked in the form, deleteImg is undefined
        yield querySQL('DELETE FROM images WHERE filename IN (?)', [deleteImg]);
        yield cloudinary.api.delete_resources(deleteImg); // delete from cloudinary
    }
    ;
    req.flash('success', 'The campground updated!');
    res.redirect(`/campgrounds/${campground_id}`);
});
module.exports.deleteCamp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const campground_id = req.params.id;
    const resultsImages = yield querySQL('SELECT filename FROM images WHERE campground_id = ?', [Number(campground_id)]);
    const deleteImg = resultsImages.map((element) => (element.filename));
    if (deleteImg.length > 0) { // here deleteImg is array
        yield querySQL('DELETE FROM images WHERE filename IN (?)', [deleteImg]);
        yield cloudinary.api.delete_resources(deleteImg); // delete from cloudinary
    }
    ;
    yield querySQL('DELETE FROM campgrounds WHERE campground_id = ?', [Number(campground_id)]);
    // reviews and images belongs to this campground will be auto deleted by table schema
    req.flash('success', `The campground deleted!`);
    res.redirect('/campgrounds');
});
function composeCamps(campgrounds) {
    return __awaiter(this, void 0, void 0, function* () {
        const camps = [];
        for (let i = 0; i < campgrounds.length; i++) {
            const _id = campgrounds[i].campground_id;
            const title = campgrounds[i].title;
            const price = campgrounds[i].price;
            const description = campgrounds[i].description;
            const location = campgrounds[i].location;
            // get images
            const resultsImages = yield querySQL('SELECT * FROM images WHERE campground_id = ?', [campgrounds[i].campground_id]);
            const cloudImg = resultsImages.map((element) => {
                return {
                    url: element.url,
                    thumbnail: element.url.replace('/upload/', '/upload/c_fit,h_250,w_250/'),
                    filename: element.filename
                };
            });
            // get author
            const resultsUser = yield querySQL('SELECT username, user_id FROM users WHERE user_id = ?', [campgrounds[i].author_id]);
            const author = resultsUser[0];
            // get reviews
            const resultsReviews = yield querySQL('SELECT * FROM reviews WHERE campground_id = ?', [campgrounds[i].campground_id]);
            const reviews = yield composeReviews(resultsReviews);
            // package info
            camps.push({ _id, title, price, description, location, author, reviews, cloudImg });
        }
        return camps;
    });
}
;
function composeReviews(reviews) {
    return __awaiter(this, void 0, void 0, function* () {
        const composedReviews = [];
        for (let i = 0; i < reviews.length; i++) {
            const reviewAuthor = yield querySQL('SELECT * FROM users WHERE user_id = ?', [reviews[i].author_id]);
            composedReviews.push({
                body: reviews[i].body,
                rating: reviews[i].rating,
                _id: reviews[i].review_id,
                author: {
                    username: reviewAuthor[0].username,
                    id: reviewAuthor[0].user_id
                }
            });
        }
        ;
        return composedReviews;
    });
}
;
//# sourceMappingURL=campgrounds.js.map