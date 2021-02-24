const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = mongoose.Schema(
    {
        content: {
            type: String,
        },
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        files: {
            type: Array,
            default: [],
        },
        date: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = { Blog };
