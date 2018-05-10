const express = require("express");
const router = express.Router();
const Thread = require("../models/thread");
const Post = require("../models/post");
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
var cloudinary = require('cloudinary');
const uploadCloud = require('../config/cloudinary');


router.get('/create-thread', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.render('thread/thread');
})

router.post('/create-thread', uploadCloud.single('photo'), (req, res, next) => {
    const title = req.body.threadTitle
    const picturePath;

    if (!req.file.url)
        picturePath = 'http://res.cloudinary.com/ddibftjux/image/upload/v1525990468/images/my-file-name.png';
    else
        picturePath = req.file.url;

    Thread.findOne({ title }, (err, findTitle) => {
        console.log(findTitle, typeof (findTitle));
        if (findTitle !== null) {
            res.render('thread/thread', { message: "Existing thread" });
        }

        else {

            console.log('create new thread')

            const newThread = new Thread({
                title: title,
                moderatorId: req.user._id
            })

            newThread.save()
                .then(() => res.redirect('/'))
                .catch(err => res.send(err));
        }
    })

})

router.get('/thread/:id/posts', (req, res, next) => {
    const id = req.params.id;

    Post.find({threadId: id})
        .then(response => {
            res.json(response);
        })
})

module.exports = router;
