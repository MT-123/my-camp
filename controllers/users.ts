const querySQL = require('../utils/querySQL');
const {genPassword}=require('../utils/cryptoSQL');
import { Request, Response, NextFunction } from "express";


module.exports.renderRegister = (req: Request, res: Response) => {
    res.render('./users/register');
};

module.exports.createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user } = req.body;
        const {hash,salt} = genPassword(user.password)
        const {insertId} =await querySQL('INSERT INTO users (username,email,hash,salt) VALUES (?,?,?,?)',
        [user.username,user.email, hash, salt]);
        const registerUser = { username: user.username, id: insertId};

        req.login(registerUser, (err) => {
            if (err) { return next(err); }
            req.flash('success', 'Welcome, registration completed!');
            res.redirect('/campgrounds');
            // cause the login takes time, the redirect has to be inside this callback fn 
            // otherwise, the req.user will not be existing during redircting
        });
    } catch (err:any) {
        // if the register fails(ex. username has been used), send the err message 
        req.flash('error', err.message);
        res.redirect('/register');
    };
};

module.exports.renderLogin = (req: Request, res: Response) => {
    res.render('./users/login');
};

module.exports.redirectLoggedIn = (req: Request, res: Response) => {
    req.flash('success', `Hi ${req.body.username}, welcome back.`);
    const redirectPath = req.session.returnTo || '/campgrounds';
    // retrieve the original url
    delete req.session.returnTo;
    // delete the returnTo property
    res.redirect(redirectPath);
};

module.exports.logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', 'Logged out. Goodbye!');
        res.redirect('/campgrounds');
    });
};

export {};
