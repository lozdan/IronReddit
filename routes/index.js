const express = require('express');
const router = express.Router();
const Threads = require('../models/thread');
const User = require('../models/user');

/* GET home page */
router.get('/', (req, res, next) => {
  Threads.find()
    .then(threads => {
      Promise.all(threads.map(thread => User.findById(thread.moderatorId).then(moderator => {
        thread = thread.toObject();
        thread.moderator = moderator;
        return thread;
      }))).then(threads => {
        res.render('index', { threads });
      })
    })
  // res.render('index')
})

module.exports = router;
