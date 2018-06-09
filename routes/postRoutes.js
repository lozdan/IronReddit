const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require('../models/post');
const Thread = require('../models/thread');
const Vote = require('../models/vote');
const Comment = require('../models/comment')
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
var cloudinary = require('cloudinary');
const uploadCloud = require('../config/cloudinary');

router.get('/create-post-text', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.render('post/post-text');

})

router.post('/create-post-text', (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const thread = req.body.thread;

    Thread.findOne({ title: thread })
        .then(match => {
            const newPost = new Post({
                title,
                description: text,
                threadId: match._id,
                creatorId: req.user._id,
                type: 'text'
            })
            console.log(newPost.text);

            newPost.save()
                .then(() => res.redirect('/'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

});

router.get('/create-post-image', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.render('post/post-image');
})

router.post('/create-post-image', uploadCloud.single('photo'), (req, res, next) => {
    const title = req.body.title;
    const thread = req.body.thread;

    Thread.findOne({ title: thread })
        .then(match => {
            const newPost = new Post({
                title,
                threadId: match._id,
                creatorId: req.user._id,
                type: 'picture',
                picturePath: req.file.url
            })
            console.log(newPost.text);

            newPost.save()
                .then(() => res.redirect('/'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});



router.get('/create-post-link', (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    }
    res.render('post/post-link');
})

router.post('/create-post-link', (req, res, next) => {

    const title = req.body.title;
    const thread = req.body.thread;

    Thread.findOne({ title: thread })
        .then(match => {
            const newPost = new Post({
                title,
                threadId: match._id,
                creatorId: req.user._id,
                type: 'link',
                link: req.body.link
            })
            console.log(newPost.text);

            newPost.save()
                .then(() => res.redirect('/'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

router.get('/post/:id', (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId)
        .then(post => { res.render('post/show-post', { post }) })
        .catch(err => console.log(err));
})

router.get('/post/upvote/:id', (req, res, next) => {
    const userId = req.user._id;
    const postId = req.params.id;

    Post.findById(postId)
        .then(post => {

            Vote.findOne({ userId, postId })
                .then(match => {
                    if (!match) {
                        const newVote = new Vote({
                            userId,
                            postId,
                        })

                        post.votes++;

                        newVote.save()
                        post.save();
                        res.json(post.votes);
                    }
                    else {
                        console.log("exist")
                        if (match.upvote === true) {
                            match.upvote = false;
                            post.votes--;
                        }
                        else {
                            match.upvote = true;
                            post.votes++;
                        }

                        match.save();
                        post.save();
                        console.log(match)
                        res.json(post.votes);
                    }
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
})

router.get('/post/:id/downvote', (req, res, next) => {
    const newUserPost = new UserPost({
        upvote: false,
        downvote: true
    })
})

router.get('/post/:id/comment', (req, res, next) => {
    Comment.find({ postId: req.params.id })
        // .then( comments => {
        //     if (!comments){
        //         res.json({})
        //     }
        //     res.json(comments);

        // })


        .then(comments => {
            if (!comments) {
                res.json({})
            }
            Promise.all(comments.map(comment => User.findById(comment.creatorId).then(creator => {
                comment = comment.toObject();
                comment.creator = creator;
                return comment;
            }))).then(comments => {
                res.json(comments);
            })
        })
})

router.post('/update-img-prof', uploadCloud.single('photo'), (req, res, next) => {

})

router.get(`/delete-post/:id`, (req, res, next) => {
    Post.findByIdAndRemove(req.params.id)
    .then(
        deletedPost => {res.redirect('/profile')}
    )
    .catch( err => console.log(err));
})

module.exports = router;
