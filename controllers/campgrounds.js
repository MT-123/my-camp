const Campground = require('../models/campground'); // import the model
const { cloudinary } = require('../utils/cloudinary')


module.exports.renderIndex = async (req, res) => {
    const camps = await Campground.find({});
    res.render('./campgrounds/index', { camps });
};

module.exports.renderNewForm = (req, res) => {
    res.render('./campgrounds/new');
};

module.exports.createCamp = async (req, res, next) => {
    const { campground } = req.body;
    const imgURL = req.files.map((arr) => ({ filename: arr.filename, url: arr.path }));
    // req.files is added after upload.array() middleware
    const newCamp = new Campground(campground);
    newCamp.author = req.user._id;// req.user is created by passport after login done
    newCamp.cloudImg = imgURL;
    await newCamp.save();
    req.flash('success', 'A new campground added!');// push a flash message
    res.redirect(`/campgrounds/${newCamp.id}`);
};

module.exports.readCamp = async (req, res, next) => {
    // name the url with hierarchy structure(home/index/element)
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }// populate multiple layers
    }).populate('author', 'username');
    // only populate the author.username for user private protection

    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
        // use return to end the code here to aviod execute the render below
    }
    res.render('./campgrounds/show', { camp });
};

module.exports.renderEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'no such campground!');
        return res.redirect('/campgrounds');
    }
    res.render('./campgrounds/edit', { camp });
};

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const { campground, deleteImg } = req.body;
    const imgURL = req.files.map((arr) => ({ filename: arr.filename, url: arr.path }));
    const camp = await Campground.findByIdAndUpdate(id, campground);
    if (deleteImg) {
        await camp.updateOne({
            $pull: { cloudImg: { filename: { $in: deleteImg } } },
        })
        await cloudinary.api.delete_resources(deleteImg);// delete from cloudinary
    }
    camp.cloudImg.push(...imgURL);
    await camp.save();
    req.flash('success', 'The campground updated!');
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    const deleteImgs = camp.cloudImg.map((arr)=>(arr.filename))
    await cloudinary.api.delete_resources(deleteImgs).then(result=>console.log(result));
    // delete from cloudinary
    req.flash('success', `The campground ${camp.title} deleted!`);
    res.redirect('/campgrounds');
};
