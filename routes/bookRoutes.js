var express = require('express');
var bookRoutes = express.Router();
var Book = require("../models/bookmodel")
var User = require("../models/user")


bookRoutes.get("/", function (req, res) {
    User.find({
            _id: req.user._id
        })
        .populate({
            path: 'readingList.past readingList.current readingList.future',
            model: 'Book',
            populate: {
                path: 'user_comment.user',
                model: 'User',
                select: '-password'
            }
        })
        .exec(function (err, books) {
            if (err) return res.status(500).send(err);
            res.send(books)
        })
})

bookRoutes.post("/user/:list", function (req, res) {
    var listType = req.params.list;


    if (!req.body.isbn_10) {
        req.body.isbn_10 = "00000000000"
    }
    if (!req.body.isbn_13) {
        req.body.isbn_13 = "00000000000000"
    }

    Book.findOne({
        $or: [{
            isbn_10: req.body.isbn_10
        }, {
            isbn_13: req.body.isbn_13
        }]
    }, function (err, book) {
        if (err) return res.status(500).send(err);
        if (!book) {
            var text = req.body.user_comment;
            delete req.body.user_comment;
            var newBook = new Book(req.body);
            if (text !== undefined) {
                var newComment = {
                    comment: text,
                    user: req.user._id
                }
                newBook.user_comment.push(newComment);
            }

            newBook.save(function (err) {
                if (err) return res.status(500).send(err);

                User.findOne({
                    _id: req.user._id
                }, function (err, user) {
                    if (err) return res.status(500).send(err);

                    user.readingList[listType].push(newBook._id)

                    user.save(function (err, user) {
                        if (err) return res.status(500).send(err);

                        return res.status(200).send(user)
                    })
                })


            })
        }
        if (book) {

            User.findOne({
                _id: req.user._id
            }, function (err, user) {
                if (err) return res.status(500).send(err);

                user.readingList[listType].push(book._id)

                if (req.body.user_comment) {
                    var newComment = {
                        comment: req.body.user_comment,
                        user: req.user._id
                    }
                    book.user_comment.push(newComment);
                }
                Book.findOneAndUpdate({
                    _id: book._id
                }, book, {
                    new: true
                }, function (err, updatedBook) {
                    if (err) return res.status(500).send(err);
                })
                user.save(function (err, user) {
                    if (err) return res.status(500).send(err);
                    return res.status(200).send(user)
                })
            })

        }


    })
})


bookRoutes.put("/user/:list", function (req, res) {
    var listType = req.params.list
    var bookId = req.body.bookId

    User.findOne({
        _id: req.user._id
    }, function (err, user) {

        if (err) return res.status(500).send(err);

        var past = user.readingList.past;
        var future = user.readingList.future;
        var current = user.readingList.current;

        if (past.indexOf(bookId > -1)) {
            past.splice(past.indexOf(bookId), 1)
        }
        if (future.indexOf(bookId > -1)) {
            future.splice(future.indexOf(bookId), 1)
        }
        if (current.indexOf(bookId > -1)) {
            current.splice(past.indexOf(bookId), 1)
        }
        if (listType != 'delete') {
            user.readingList[listType].push(req.body.bookId);
        }
        user.save(function (err, user) {
            if (err) return res.status(500).send(err);
            Book.findOne({
                _id: bookId
            }, function (err, book) {
                if (err) return res.status(500).send(err);
                if (req.body.user_comment) {
                    var newComment = {
                        comment: req.body.user_comment,
                        user: req.user._id
                    }
                    book.user_comment.push(newComment);
                }
                Book.findOneAndUpdate({
                    _id: book._id
                }, book, {
                    new: true
                }, function (err, updatedBook) {
                    if (err) return res.status(500).send(err);
                })
            })
            return res.status(200).send(user)
        })

    })

})



bookRoutes.delete("/:id", function (req, res) {
    Book.findOneAndRemove({
        _id: req.params.id
    }, function (err, book) {
        if (err) return res.status(500).send(err);
        res.send({
            message: "removed book"
        })
    })


})

module.exports = bookRoutes;