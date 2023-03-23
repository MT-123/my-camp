"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const querySQL = require('./querySQL');
const seedSQLDB = require('../seeds/indexSQL');
function checkDataAndSeed() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('! checking SQL data existance');
        try {
            var haveUsers = yield querySQL('SELECT user_id FROM users', []);
        }
        catch (err) {
            console.log('X query SQL failed:', err);
            return;
        }
        if (!haveUsers.length) {
            console.log('! No data exists. Initialize and seed data');
            yield seedSQLDB();
            console.log('V Initialation and seeding done');
            return;
        }
        return console.log('V SQL data exists!');
    });
}
module.exports = checkDataAndSeed;
