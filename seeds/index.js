// This is seeding data to the my-camp
// !!! the collection campgrounds will be erased first!
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/my-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('V Database connected :)');
});

seedDB();

async function seedDB() {
    await Campground.deleteMany({});
    // delete all history data
    for (let i = 0; i < 50; i++) {
        const cityIndex = Math.floor(Math.random() * cities.length) + 1;
        const city = cities[cityIndex];
        const price = Math.floor(Math.random() * 100) + 1;
        const title = sampleArray(descriptors) + ' ' + sampleArray(places);
        // randomly select words from the dictionary
        
        const camp = new Campground({
            location: `${city.city}, ${city.state}`,
            price,//equal to "price: price" due to the same names
            title,
            description: 'Good'
        });
        await camp.save();
    };
};

function sampleArray(array) {//randomly return an element from the input array
    return array[Math.floor(Math.random() * array.length)];
};
