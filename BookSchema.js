const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: String,
    genre: String,
    isBorrowed: { type: Boolean },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
});

module.exports = mongoose.model('Book', bookSchema);
