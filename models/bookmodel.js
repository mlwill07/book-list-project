var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    subtitle: String,
    authors: [String],
    description: String,
    imgUrl: String,
    user_rating: Number,
    pub_date: String,
    publisher: String,
    infoLink: String,
    user_comment: [{
        comment: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }], 
    isbn_10: {
        type: String,
        unique: true
    },
    isbn_13: {
        type: String,
        unique: true
    }
})

bookSchema.pre('remove', function (next) {
    this.model('User').update(
        {_id: {$in: this.users}}, 
        {$pull: {books: this._id}},
        {multi: true},
        next
    );
});

module.exports = mongoose.model('Book', bookSchema)