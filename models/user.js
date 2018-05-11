const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    bio: String,
    picturePath: {type: String, default: 'https://res.cloudinary.com/ddibftjux/image/upload/v1526028453/Logo_reddit_white.png'},
    role: [String]
},
{
    timestamps: { 
        createdAt: "created_at",
        updatedAt: "updated_at" 
    }
});

module.exports = mongoose.model('User', userSchema);

