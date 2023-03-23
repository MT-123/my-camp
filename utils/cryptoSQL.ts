const querySQL = require('./querySQL');
const crypto = require('crypto');// node built-in
import {Request, Response, NextFunction} from "express";
import {AuthenticateCallback} from "passport";

const pbkdf2Config = {
    iterations: 10000,
    keylen: 32,
    digest: 'sha256',
    saltSize: 32,
}

module.exports.customField = {
    usernameField: 'username',
    passwordField: 'password',
};

module.exports.verifyUser= async (username:string, password:string, cb:AuthenticateCallback)=>{
    const results = await querySQL('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length === 0) { 
        return cb(
            null,
            false,
            { message: 'Incorrect username or password.'
        });
    };

    //verify password
    crypto.pbkdf2(
        password,
        results[0].salt,
        pbkdf2Config.iterations,
        pbkdf2Config.keylen,
        pbkdf2Config.digest,
        (err:any, hashedPassword:string) => {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(Buffer.from(results[0].hash, 'hex'), hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            const username = results[0].username;
            const id = results[0].user_id;
            return cb(null, { username, id});
        });
}

module.exports.genPassword=(password:string)=>{
    const salt = crypto.randomBytes(pbkdf2Config.saltSize).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, pbkdf2Config.iterations, pbkdf2Config.keylen, pbkdf2Config.digest).toString('hex');
    return { salt, hash };
}

module.exports.userDuplicate=(req:Request, res:Response, next:NextFunction)=>{
    const { username } = req.body.user;
    const results = querySQL('SELECT * FROM users WHERE username = ?', [username]);
    if (results.length) { 
        req.flash('error', 'username already exists!');
        return res.redirect('/register');
    };
    return next();
};
export {};
