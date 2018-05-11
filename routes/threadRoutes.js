const express = require("express");
const router = express.Router();
const Thread = require("../models/thread");
const Post = require("../models/post");
const User = require("../models/user")
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
    const title = req.body.threadTitle;
    console.log(req.file)
    // let picturePath = req.file.url;


    Thread.findOne({ title }, (err, findTitle) => {
        // console.log(findTitle, typeof (findTitle));
        // console.log(req.file.url);

        if (findTitle !== null) {
            res.render('thread/thread', { message: "Existing thread" });
        }

        else {

            if (req.file){
                console.log("new-image")
                var newThread = new Thread({
                    title: title,
                    moderatorId: req.user._id,
                    picturePath: req.file.url
                })
                newThread.save()
                .then(() => res.redirect('/'))
                .catch(err => res.send(err));
            }

            else if (!req.file) {
                console.log("here too")
                var newThread = new Thread({
                    title: title,
                    moderatorId: req.user._id,
                })
                newThread.save()
                .then(() => res.redirect('/'))
                .catch(err => res.send(err));
            }
        }
    })

})

router.get('/thread/:id/posts', (req, res, next) => {
    const id = req.params.id;

    Post.find({threadId: id})
        .then(posts => {
            Promise.all(posts.map(post => User.findById(post.creatorId).then(creator => {
              post = post.toObject();
              post.creator = creator;
              return post;
            }))).then(posts => {
              res.json(posts);
            })
          })
      })

module.exports = router;
