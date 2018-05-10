const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const postSchema = new Schema ({
    description: String,
    title: String,
    link: String,
    picturePath: String,
    threadId: String,
    creatorId: String,
    votes: {type: Number, default: 0},
    type: {type: String, enum: ['link', 'picture', 'text']}
},
{
    timestamps: { 
        createdAt: "created_at",
        updatedAt: "updated_at" 
    }
});

module.exports = mongoose.model("Post", postSchema);
