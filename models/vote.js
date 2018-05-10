const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema ({
    userId: String,
    postId: String,
    upvote: {type: Boolean, default: true},
    voteCount: Number
}) 

module.exports = mongoose.model('Vote', voteSchema);


