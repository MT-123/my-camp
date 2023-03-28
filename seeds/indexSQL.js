"use strict";
// This seeds data to the my_camp
// !!! the existing content in the tables will be erased first!
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cities_1 = __importDefault(require("./cities"));
const campTitle_1 = require("./campTitle");
const campDescription_1 = __importDefault(require("./campDescription"));
const campImg_1 = __importDefault(require("./campImg"));
const querySQL = require('../utils/querySQL');
const defaulUser = {
    user_id: 1,
    username: 'Paul',
    email: 'paul@gmail.com',
    salt: '1e386b05f5ab699a0610eee3d8070dececc112bec467102dc66050d97980fa2c',
    hash: '781d7bf1174cfca3d3f559fb0d03b74bb09f7626ec4e91df8983df803d071f3f',
    // password: 'paul123'
};
const numOfCampground = 12;
function seedSQLDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // delete all history data in tables
        yield querySQL('DELETE FROM campgrounds');
        yield querySQL('DELETE FROM images');
        yield querySQL('DELETE FROM users');
        // create default user
        yield querySQL('INSERT INTO users (user_id,username,salt,hash,email) VALUES (?,?,?,?,?)', [defaulUser.user_id, defaulUser.username, defaulUser.salt, defaulUser.hash, defaulUser.email]);
        // seeding
        for (let i = 0; i < numOfCampground; i++) {
            const campground_id = i + 1;
            const city = randomSampleArray(cities_1.default);
            const location = `${city.city}, ${city.state}`;
            const price = 0.1 * (Math.floor(Math.random() * 400) + 100); // 10~49.9
            const title = randomSampleArray(campTitle_1.descriptors) + ' ' + randomSampleArray(campTitle_1.places);
            // randomly select words from the dictionary
            const description = traverseArray(campDescription_1.default, i);
            const cloudImg = traverseArray(campImg_1.default, i);
            //write into campgrounds
            const sqlCampground = 'INSERT INTO campgrounds (title, price, description, location, campground_id) VALUES (?,?,?,?,?)';
            const valuesCampground = [title, price, description, location, campground_id];
            yield querySQL(sqlCampground, valuesCampground);
            //write into images
            const sqlImage = 'INSERT INTO images (filename, url, campground_id) VALUES (?,?,?)';
            const valuesImage = [cloudImg.filename, cloudImg.url, campground_id];
            yield querySQL(sqlImage, valuesImage);
        }
        ;
    });
}
;
function randomSampleArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
;
function traverseArray(array, i) {
    return array[(i % array.length)];
}
module.exports = seedSQLDB;
