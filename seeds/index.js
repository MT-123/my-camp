// This is seeding data to the my-camp
// !!! the collection campgrounds will be erased first!
const dbPath = process.env.DBPATH||'mongodb://localhost:27017/my-camp';
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const {campImg} = require('./campImg');

mongoose.connect(dbPath);
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
        const cityIndex = Math.floor(Math.random() * cities.length);
        const city = cities[cityIndex];
        const price = Math.floor(Math.random() * 100) + 1;
        const title = sampleArray(descriptors) + ' ' + sampleArray(places);
        // randomly select words from the dictionary
        const description = "Camping is a form of outdoor recreation involving overnight stays with a basic temporary shelter such as a tent. Camping can also include a recreational vehicle, a permanent tent, a shelter such as a bivy or tarp, or no shelter at all. Typically, participants leave developed areas to spend time outdoors, in pursuit of activities providing them enjoyment or an educational experience. Spending the night away from home distinguishes camping from day-tripping, picnicking, and other outdoor activities.";
        const cloudImg = traverseArray(campImg,i);
        const author = '63ef604a4edf098800293983';//default using registered user

        // make an instance
        const camp = new Campground({
            location: `${city.city}, ${city.state}`,
            price,//equal to "price: price" due to the same names
            title,
            description,
            author,
            cloudImg,
        });
        await camp.save();
    };
};

function sampleArray(array) {//randomly return an element from the input array
    return array[Math.floor(Math.random() * array.length)];
};

function traverseArray(array,i) {
    return array[(i % array.length)];
}
