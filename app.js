const express = require('express');
const app = express();
const path = require('path');
const mongoose=require('mongoose');
const Campground = require('./models/campground');// import the model

mongoose.connect('mongodb://localhost:27017/my-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log('V Database connected :)')
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',async (req,res)=>{
    const camps = await Campground.find({}).exec()
    res.render('./campgrounds/index',{camps})
});



app.get('/campgrounds/:id', async (req,res)=>{
    // name the url with hierarchy structure(home/index/element)
    const {id} = req.params;
    const camp = await Campground.findById(id).exec();
    res.render('./campgrounds/show',{camp})
});

app.listen(8080,()=>{
    console.log('V Port 8080 online :)')
});
