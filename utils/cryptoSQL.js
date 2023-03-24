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
const crypto = require('crypto'); // node built-in
const pbkdf2Config = {
    iterations: 10000,
    keylen: 32,
    digest: 'sha256',
    saltSize: 32,
};
module.exports.customField = {
    usernameField: 'username',
    passwordField: 'password',
};
module.exports.verifyUser = (username, password, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield querySQL('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length === 0) {
        return cb(null, false, { message: 'Incorrect username or password.'
        });
    }
    ;
    //verify password
    crypto.pbkdf2(password, results[0].salt, pbkdf2Config.iterations, pbkdf2Config.keylen, pbkdf2Config.digest, (err, hashedPassword) => {
        if (err) {
            return cb(err);
        }
        if (!crypto.timingSafeEqual(Buffer.from(results[0].hash, 'hex'), hashedPassword)) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        const username = results[0].username;
        const id = results[0].user_id;
        return cb(null, { username, id });
    });
});
module.exports.genPassword = (password) => {
    const salt = crypto.randomBytes(pbkdf2Config.saltSize).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, pbkdf2Config.iterations, pbkdf2Config.keylen, pbkdf2Config.digest).toString('hex');
    return { salt, hash };
};
module.exports.userDuplicate = (req, res, next) => {
    const { username } = req.body.user;
    const results = querySQL('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length) {
        req.flash('error', 'username already exists!');
        return res.redirect('/register');
    }
    ;
    return next();
};
