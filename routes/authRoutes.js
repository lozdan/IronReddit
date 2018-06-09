const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' });
var cloudinary = require('cloudinary');
const uploadCloud = require('../config/cloudinary');
// let myUser = require('../public/javascripts/script')

router.get('/login', (req, res, next) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
}));

router.get('/register', (req, res, next) => {
    res.render('auth/register');
})

router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    console.log(email);
    console.log(password);

    if (!email || !password) {
        res.render('auth/signup', { message: "Please enter username and password" });
        return;
    }

    User.findOne({ email: email }, (err, user) => {
        console.log(user);
        if (user !== null) {
            res.render("auth/signup", { message: "Sorry, that email already exists!" });
            return;
        }

        else {
            console.log('pass')
            const salt = bcrypt.genSaltSync(bcryptSalt),
                hashPass = bcrypt.hashSync(password, salt);

            const newUser = new User({
                username: name,
                password: hashPass,
                email: email,
                bio: ""
            })

            newUser.save()
                .then(() => res.redirect('/login'))
                .catch(err => res.send(err));
        }
    })
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;
