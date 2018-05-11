const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const threadSchema = new Schema ({
    title: String,
    moderatorId: String,
    picturePath: {type: String, default: 'https://res.cloudinary.com/ddibftjux/image/upload/v1526028453/Logo_reddit_white.png'}
},
{
    timestamps: { 
        createdAt: "created_at",
        updatedAt: "updated_at" 
    }
});

module.exports = mongoose.model('Thread', threadSchema);
