const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground'); // import the model
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// const { getgid } = require('process');
const wrapAsync = require('./utils/wrapAsync'); // to catch error from the async fn
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/my-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'X database connection error:'));
db.once('open', () => {
    console.log('V Database connected :)');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs', ejsMate);
// use ejsMate instead of the default

app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));


app.use('/campgrounds/:id', (req, res, next) => {
    // middleware for url with "/campgrounds/" by any methods
    // "/campgrounds/id/edit" will also trigger it
    console.log('! id: ', req.params.id, ' accessing!')
    return next(); // use "return" instead of just "next()"" to make sure this middleware ends here
});

// homepage
app.get('/', (req, res) => {
    res.render('home');
})

// campgrounds index page
app.get('/campgrounds', wrapAsync( async (req, res) => {
    const camps = await Campground.find({}).exec();
    res.render('./campgrounds/index', { camps });
}));

// new campground page
app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new');
});

// create
app.post('/campgrounds', wrapAsync( async (req, res) => {
    const { campground } = req.body;
    const newCamp = new Campground(campground);
    // the above line is equal to followings
    // const newCamp = new Campground({
    //         title: campground.title,
    //         price: campground.price,
    //         description: campground.description,
    //         location: campground.location,
    //     });
    // because campground is like this { title: 'newtitle', price: '33', description: 'addnew', location: 'uk' }
    await newCamp.save();
        // .catch((err) => console.log('X db save FAILED, error:\n', err));
    res.redirect(`/campgrounds/${newCamp.id}`);
}));

// Read
app.get('/campgrounds/:id', wrapAsync( async (req, res, next) => {
    // name the url with hierarchy structure(home/index/element)
    const { id } = req.params;
    const camp = await Campground.findById(id).exec();
    res.render('./campgrounds/show', { camp });
}));

// Update 1/2
app.get('/campgrounds/:id/edit', wrapAsync( async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).exec();
        // .catch((err) => console.log('X find campground for edit FAILED, id:', id, ', error:\n', err));
    res.render('./campgrounds/edit', { camp })
}));


// Update 2/2
app.put('/campgrounds/:id', wrapAsync( async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const camp = await Campground.findByIdAndUpdate(id, campground);
        // .catch((err) => console.log('X edit FAILED, id:', id, ', error:\n', err));
    res.redirect(`/campgrounds/${id}`);
}));

// Delete
app.delete('/campgrounds/:id', wrapAsync( async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
        // .catch((err) => console.log('X delete FAILED, id:', id, ', error:\n', err));
    res.redirect('/campgrounds');
}));


app.all('*', (req,res,next)=>{
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('! request url out of routes!!! url:\n', fullUrl)
    return next(new ExpressError('No such link!',404));
})


// catch error
app.use((err, req, res, next) => {
    const {statusCode = 500, message = "Internal issue :'("} = err;
    console.log('X ERROR:\n', err)
    // res.status(statusCode).send(`Something went wrong! :( <br>  ${message}`)
    res.status(statusCode).render('error',{statusCode, message})
})

app.listen(8080, () => {
    console.log('V Port 8080 online :)');
});
