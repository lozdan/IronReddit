const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const commentSchema = new Schema({
    content: String,
    postId: String,
    creatorId: String,
    depth: { type: Number, default: 0},
    parentId: { type: String, default: null },
    creatorImage: String
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });

module.exports = mongoose.model('Comment', commentSchema);

