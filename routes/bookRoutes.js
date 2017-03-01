var express = require('express');
var bookRoutes = express.Router();
var Book = require("../models/bookmodel")


bookRoutes.get("/", function(req, res){
    Book.find(function(err, book){
        if(err) return res.status(500).send(err);
        res.send(book)
    })
})

bookRoutes.post("/", function(req, res){
    var newBook = new Book(req.body);
    newBook.save(function(err){
        if(err) return res.status(500).send(err);
        res.status(200).send(newBook)
    })
})

bookRoutes.put("/:id", function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, updatedBook){
        if(err) return res.status(500).send(err);
        res.send(updatedBook);
    })
})

bookRoutes.delete("/:id", function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err, book){
        if(err) return res.status(500).send(err);
        res.send({message: "removed book"})
    })
})

module.exports = bookRoutes;