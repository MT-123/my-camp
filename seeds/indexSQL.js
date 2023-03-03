// This is seeding data to the my_camp
// !!! the tables content will be erased first!
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const { campImg } = require('./campImg');
const querySQL = require('../utils/querySQL');
const defaulUser = {
    user_id: 1,
    username: 'Paul',
    email: 'paul@gmail.com',
    salt: '1e386b05f5ab699a0610eee3d8070dececc112bec467102dc66050d97980fa2c',
    hash: '781d7bf1174cfca3d3f559fb0d03b74bb09f7626ec4e91df8983df803d071f3f',
    // password: 'paul123'
}

seedSQLDB();

async function seedSQLDB() {
    // delete all history data in tables
    await querySQL('DELETE FROM campgrounds');
    await querySQL('DELETE FROM images');
    await querySQL('DELETE FROM users');

    // create default user
    await querySQL(
        'INSERT INTO users (user_id,username,salt,hash,email) VALUES (?,?,?,?,?)',
        [defaulUser.user_id,defaulUser.username,defaulUser.salt,defaulUser.hash,defaulUser.email]
        );

    // seeding
    for (let i = 0; i < 12; i++) {
        const campground_id = i + 1;
        const cityIndex = Math.floor(Math.random() * cities.length);
        const city = cities[cityIndex];
        const location = `${city.city}, ${city.state}`;
        const price = 0.1 * (Math.floor(Math.random() * 500) + 100);
        const title = sampleArray(descriptors) + ' ' + sampleArray(places);
        // randomly select words from the dictionary
        const description = "Camping is a form of outdoor recreation involving overnight stays with a basic temporary shelter such as a tent. Camping can also include a recreational vehicle, a permanent tent, a shelter such as a bivy or tarp, or no shelter at all. Typically, participants leave developed areas to spend time outdoors, in pursuit of activities providing them enjoyment or an educational experience. Spending the night away from home distinguishes camping from day-tripping, picnicking, and other outdoor activities.";
        const cloudImg = traverseArray(campImg, i);

        //write into campgrounds
        const sqlCampground = 'INSERT INTO campgrounds (title, price, description, location, campground_id) VALUES (?,?,?,?,?)';
        const valuesCampground = [title, price, description, location, campground_id];
        await querySQL(sqlCampground, valuesCampground);
        
        //write into images
        const sqlImage = 'INSERT INTO images (filename, url, campground_id) VALUES (?,?,?)';
        const valuesImage = [cloudImg.filename, cloudImg.url, campground_id];
        await querySQL(sqlImage, valuesImage);
    };
};

function sampleArray(array) {//randomly return an element from the input array
    return array[Math.floor(Math.random() * array.length)];
};

function traverseArray(array, i) {
    return array[(i % array.length)];
}
