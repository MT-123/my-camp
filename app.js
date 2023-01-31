const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');// import the model
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/my-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'X database connection error:'));
db.once('open', () => {
    console.log('V Database connected :)');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.engine('ejs',ejsMate);
// use ejsMate instead of the default

app.use(express.urlencoded({ extended: true })); // for req.body
app.use(methodOverride('_method'));

// try middleware
app.use('/campgrounds/:id',(req,res,next)=>{
    // middleware for url with "/campgrounds/" by any methods
    // "/campgrounds/id/edit" will also trigger it
    console.log('! id: ',req.params.id,' accessing!!!')
    return next(); // use "return" instead of just "next()"" to make sure this middleware ends here
});

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const camps = await Campground.find({}).exec();
    res.render('./campgrounds/index', { camps });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('./campgrounds/new');
});

// create
app.post('/campgrounds', async (req, res) => {
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
    res.redirect(`/campgrounds/${newCamp.id}`);
});

// Read
app.get('/campgrounds/:id', async (req, res) => {
    // name the url with hierarchy structure(home/index/element)
    const { id } = req.params;
    const camp = await Campground.findById(id).exec();
    res.render('./campgrounds/show', { camp })
});

// Update 1/2
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).exec();
    res.render('./campgrounds/edit', { camp })
});


// Update 2/2
app.put('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    const { campground } = req.body;
    const camp = await Campground.findByIdAndUpdate(id, campground);
    res.redirect(`/campgrounds/${id}`);
})

// Delete
app.delete('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

// catch the url that missed the routes above
app.use((req,res,next)=>{
    res.status(404).send('Not found :\'( ');
    // set status to 404
    console.log('! request url out of routes!!!')
    return next();
})

app.listen(8080, () => {
    console.log('V Port 8080 online :)');
});
