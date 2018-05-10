const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const threadSchema = new Schema ({
    title: String,
    moderatorId: String,
    picturePath: String
},
{
    timestamps: { 
        createdAt: "created_at",
        updatedAt: "updated_at" 
    }
});

module.exports = mongoose.model('Thread', threadSchema);
