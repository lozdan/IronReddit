const express = require("express");
const router = express.Router();
const Thread = require("../models/thread");
const Post = require("../models/post");
const User = require("../models/user")
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
var cloudinary = require('cloudinary');
const uploadCloud = require('../config/cloudinary');

router.get('/profile', (req, res, next) => {
    if (!req.user)
        res.redirect("/login");
    let user = req.user;
    Post.find({ creatorId: req.user._id })
        .then(posts => {
            console.log(user);
            res.render('profile', { posts, user });
        })
})


router.post('/update-prof-img', uploadCloud.single('photo'), (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { picturePath: req.file.url })
        .then(() => res.redirect('/profile'))
        .catch(err => console.log(err));
})



module.exports = router;
