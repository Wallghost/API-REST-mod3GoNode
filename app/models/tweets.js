const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 280,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
},{
    timestamps: true,
});


mongoose.model('Tweet', tweetSchema);
