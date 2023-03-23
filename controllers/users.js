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
const querySQL = require('../utils/querySQL');
const { genPassword } = require('../utils/cryptoSQL');
module.exports.renderRegister = (req, res) => {
    res.render('./users/register');
};
module.exports.createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req.body;
        const { hash, salt } = genPassword(user.password);
        const { insertId } = yield querySQL('INSERT INTO users (username,email,hash,salt) VALUES (?,?,?,?)', [user.username, user.email, hash, salt]);
        const registerUser = { username: user.username, id: insertId };
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome, registration completed!');
            res.redirect('/campgrounds');
            // cause the login takes time, the redirect has to be inside this callback fn 
            // otherwise, the req.user will not be existing during redircting
        });
    }
    catch (err) {
        // if the register fails(ex. username has been used), send the err message 
        req.flash('error', err.message);
        res.redirect('/register');
    }
    ;
});
module.exports.renderLogin = (req, res) => {
    res.render('./users/login');
};
module.exports.redirectLoggedIn = (req, res) => {
    req.flash('success', `Hi ${req.body.username}, welcome back.`);
    const redirectPath = req.session.returnTo || '/campgrounds';
    // retrieve the original url
    delete req.session.returnTo;
    // delete the returnTo property
    res.redirect(redirectPath);
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out. Goodbye!');
        res.redirect('/campgrounds');
    });
};
//# sourceMappingURL=users.js.map