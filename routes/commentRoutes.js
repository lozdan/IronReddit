const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require('../models/post');
const Thread = require('../models/thread');
const Vote = require('../models/vote');
const Comment = require('../models/comment')


router.post("/new-comment/:postId", (req, res, next) => {
    const content = req.body.comment;
    const creatorId = req.user._id;
    const postId = req.params.postId;

    const newComment = new Comment ({
        content,
        creatorId,
        postId
    })

    newComment.save()
    .then( () => res.redirect('/') )
    .catch( err => console.log(err));
})

module.exports = router;