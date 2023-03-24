const querySQL = require('./querySQL');
const seedSQLDB = require('../seeds/indexSQL');

async function checkDataAndSeed() {
    console.log('! checking SQL data existance');
    try {
        var haveUsers = await querySQL('SELECT user_id FROM users', []);
    } catch (err) {
        console.log('X query SQL failed:', err);
        return;
    }
    if (!haveUsers.length) {
        console.log('! No data exists. Initialize and seed data');
        await seedSQLDB();
        console.log('V Initialation and seeding done');
        return;
    }
    return console.log('V SQL data exists!');
}

module.exports = checkDataAndSeed;
export {};
