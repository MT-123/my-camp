// This seeds data to the my_camp
// !!! the existing content in the tables will be erased first!

import cities from './cities';
import { descriptors, places } from './campTitle';
import campDescription from './campDescription';
import campImg from './campImg';

import {defaultUsers} from './users'

const querySQL = require('../utils/querySQL');

const numOfCampground = 12;

async function seedSQLDB() {
    // delete all history data in tables
    await querySQL('DELETE FROM campgrounds');
    await querySQL('DELETE FROM images');
    await querySQL('DELETE FROM users');

    for (let i = 0; i < defaultUsers.length; i++) {
        const id = i + 1;// id begins from 1
        const username = defaultUsers[i][0];
        const hash = defaultUsers[i][1];
        const salt = defaultUsers[i][2];
        const email = defaultUsers[i][3];

        // create default user
        await querySQL(
            'INSERT INTO users (user_id,username,salt,hash,email) VALUES (?,?,?,?,?)',
            [id, username, salt, hash, email]
        );
    }

    // seeding
    for (let i = 0; i < numOfCampground; i++) {
        const campground_id = i + 1;
        const city = randomSampleArray(cities);
        const location = `${city.city}, ${city.state}`;
        const price = 0.1 * (Math.floor(Math.random() * 400) + 100);// 10~49.9
        const title = randomSampleArray(descriptors) + ' ' + randomSampleArray(places);
        // randomly select words from the dictionary
        const description = traverseArray(campDescription, i);
        const cloudImg = traverseArray(campImg, i);
        const author_id = Math.floor(Math.random() * defaultUsers.length ) + 1;

        //write into campgrounds
        const sqlCampground = 'INSERT INTO campgrounds (title, price, description, location, campground_id, author_id) VALUES (?,?,?,?,?,?)';
        const valuesCampground = [title, price, description, location, campground_id, author_id];
        await querySQL(sqlCampground, valuesCampground);

        //write into images
        const sqlImage = 'INSERT INTO images (filename, url, campground_id) VALUES (?,?,?)';
        const valuesImage = [cloudImg.filename, cloudImg.url, campground_id];
        await querySQL(sqlImage, valuesImage);
    };
};

function randomSampleArray(array: any[]): any {//randomly return an element from the input array
    return array[Math.floor(Math.random() * array.length)];
};

function traverseArray(array: any[], i: number): any {
    return array[(i % array.length)];
}

module.exports = seedSQLDB;
