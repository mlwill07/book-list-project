var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    authors: [String],
    description: String,
    imgUrl: String,
    user_rating: Number,
    listType: String,
    pub_date: String,
    publisher: String,
    infoLink: String,
    user_comment: [String],
    isbn_10: {
        type: String,
        unique: true
    }
})

module.exports = mongoose.model('book', bookSchema)