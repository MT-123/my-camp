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
        const description = "Camping is a form of outdoor recreation involving overnight stays with a basic temporary shelter such as a tent. Camping can also include a recreational vehicle, a permanent tent, a shelter such as a bivy or tarp, or no shelter at all. Typically, participants leave developed areas to spend time outdoors, in pursuit of activities providing them enjoyment or an educational experience. Spending the night away from home distinguishes camping from day-tripping, picnicking, and other outdoor activities.";
        const image = 'https://plus.unsplash.com/premium_photo-1664367986041-22471a2d3657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80';
        const camp = new Campground({
            location: `${city.city}, ${city.state}`,
            price,//equal to "price: price" due to the same names
            title,
            description,
            image
        });
        await camp.save();
    };
};

function sampleArray(array) {//randomly return an element from the input array
    return array[Math.floor(Math.random() * array.length)];
};
