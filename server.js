var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var port = process.env.PORT || 8000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect('mongodb://localhost/bookshelves',  function(err){
    if(err) {
        throw err;
    }
    console.log("connected to the database")
});

app.listen(port, function(){
    console.log('Listening on port: ' + port)
})