const querySQL = require('../utils/querySQL');
const { cloudinary } = require('../utils/cloudinary')
import { Request, Response, NextFunction } from "express";

interface Camp {
    campground_id: number;
    title: string;
    price: number;
    description: string;
    location: string;
    author_id:number;
    url?: string;
}
interface Image {
    image_id:number;
    filename:string;
    url:string;
    campground_id:number;
}
interface Review {
    review_id:number;
    rating:number;
    body:string;
    author_id:number;
    campground_id:number;
}

module.exports.renderIndex = async (req: Request, res: Response) => {
    const resultsCamp = await querySQL("\
    SELECT campgrounds.*, images.url \
    FROM campgrounds LEFT JOIN images \
    ON images.image_id= \
    (SELECT image_id FROM images \
        WHERE images.campground_id = campgrounds.campground_id \
        LIMIT 1)\
        ");
    const camps = resultsCamp.map((camp: Camp) => {
        const _id = camp.campground_id;
        const title = camp.title;
        const price = camp.price;
        const description = camp.description;
        const location = camp.location;
        const cloudImg = [{ url: camp.url }];
        return { _id, title, price, description, location, cloudImg };
    });
    res.render('./campgrounds/index', { camps });
};

module.exports.renderUserIndex = async (req: Request, res: Response) => {
    const author_id = req.user?.id;
    const resultsCamp = await querySQL('SELECT * FROM campgrounds WHERE author_id = ?' , [Number(author_id)]);
    const camps = await composeCamps(resultsCamp);
    res.render('./campgrounds/user_camps', { camps });
};

module.exports.renderNewForm = (req: Request, res: Response) => {
    res.render('./campgrounds/new');
};

module.exports.createCamp = async (req: Request, res: Response, next: NextFunction) => {
    const { title, price, location, description } = req.body.campground;
    const author_id = req.user?.id// req.user is created by passport after login done

    const resultsCamp = await querySQL('INSERT INTO campgrounds \
    (title, price, location, description, author_id) VALUES (?,?,?,?,?)',
    [title, price, location, description, author_id]);

    const imgValues = (req.files as Express.Multer.File[]).map((arr:Express.Multer.File) => ([ arr.filename, arr.path, resultsCamp.insertId ]));
    // req.files is added after upload.array() middleware
    if (imgValues.length>0){
    await querySQL('INSERT INTO images \
    (filename, url, campground_id) VALUES ?',
    [imgValues]);
    };
    // insertId is the primary key of the inserted row

    req.flash('success', 'A new campground added!');// push a flash message
    res.redirect(`/campgrounds/${resultsCamp.insertId}`);
};

module.exports.readCamp = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const resultsCamp = await querySQL('SELECT * FROM campgrounds WHERE campground_id = ?' , [Number(id)]);
    const camps = await composeCamps(resultsCamp);
    const camp = camps[0];

    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }

    res.render('./campgrounds/show', { camp });
};

module.exports.renderEdit = async (req: Request, res: Response) => {
    const { id } = req.params;
    const resultsCamp = await querySQL('SELECT * FROM campgrounds WHERE campground_id = ?' , [Number(id)]);
    const camps = await composeCamps(resultsCamp);
    const camp = camps[0];

    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }
    res.render('./campgrounds/edit', { camp });
};

module.exports.updateCamp = async (req: Request, res: Response) => {
    const campground_id = req.params.id;
    const { title, price, location, description } = req.body.campground;
    const { deleteImg } = req.body;

    await querySQL('UPDATE campgrounds \
    SET title =?, price=?, location=?, description=? \
    WHERE campground_id = ?',
    [title, price, location, description, Number(campground_id)]);

    const imgValues = (req.files as Express.Multer.File[]).map((arr:Express.Multer.File) => ([ arr.filename, arr.path, campground_id ]));
    if (imgValues.length>0){
        await querySQL('INSERT INTO images \
        (filename, url, campground_id) VALUES ?',
        [imgValues]);
    };

    if (deleteImg) { // if not images checked in the form, deleteImg is undefined
        await querySQL('DELETE FROM images WHERE filename IN (?)',[deleteImg])
        await cloudinary.api.delete_resources(deleteImg);// delete from cloudinary
    };
    req.flash('success', 'The campground updated!');
    res.redirect(`/campgrounds/${campground_id}`);
};

module.exports.deleteCamp = async (req: Request, res: Response) => {
    const campground_id = req.params.id;
    const resultsImages:{filename:string}[]= await querySQL('SELECT filename FROM images WHERE campground_id = ?', [Number(campground_id)]);
    const deleteImg=resultsImages.map((element)=>(element.filename));
    
    if (deleteImg.length>0) { // here deleteImg is array
        await querySQL('DELETE FROM images WHERE filename IN (?)',[deleteImg])
        await cloudinary.api.delete_resources(deleteImg);// delete from cloudinary
    };
    
    await querySQL('DELETE FROM campgrounds WHERE campground_id = ?',[Number(campground_id)]);
    // reviews and images belongs to this campground will be auto deleted by table schema

    req.flash('success', `The campground deleted!`);
    res.redirect('/campgrounds');
};

async function composeCamps(campgrounds:Camp[]) {
    const camps = [];
    for (let i = 0; i < campgrounds.length; i++) {
        const _id = campgrounds[i].campground_id;
        const title = campgrounds[i].title;
        const price = campgrounds[i].price;
        const description = campgrounds[i].description;
        const location = campgrounds[i].location;

        // get images
        const resultsImages: Image[] = await querySQL('SELECT * FROM images WHERE campground_id = ?', [campgrounds[i].campground_id]);
        const cloudImg = resultsImages.map((element) => {
            return {
                url: element.url,
                thumbnail: element.url.replace('/upload/', '/upload/c_fit,h_250,w_250/'),
                filename: element.filename
            }
        });

        // get author
        const resultsUser = await querySQL('SELECT username, user_id FROM users WHERE user_id = ?', [campgrounds[i].author_id]);
        const author = resultsUser[0];

        // get reviews
        const resultsReviews = await querySQL('SELECT * FROM reviews WHERE campground_id = ?', [campgrounds[i].campground_id]);
        const reviews = await composeReviews(resultsReviews);

        // package info
        camps.push({ _id, title, price, description, location, author, reviews, cloudImg })
    }

    return camps;
};

async function composeReviews(reviews:Review[]) {
    const composedReviews = [];
    for (let i = 0; i < reviews.length; i++) {
        const reviewAuthor = await querySQL('SELECT * FROM users WHERE user_id = ?', [reviews[i].author_id]);
        composedReviews.push({
            body: reviews[i].body,
            rating: reviews[i].rating,
            _id: reviews[i].review_id,
            author:{
                username: reviewAuthor[0].username,
                id: reviewAuthor[0].user_id
            }
        })
    };
    return composedReviews;
};

export {};
