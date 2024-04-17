const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    image: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fcalm%2F&psig=AOvVaw18UqHbhKWnlxr5WYs7T4C1&ust=1713436902708000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLjpgYGIyYUDFQAAAAAdAAAAABAE"
    },
    author: {
        type: String,
        default: "Admin",
    }
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {

        virtuals: true,
    },
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);