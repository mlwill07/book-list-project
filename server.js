var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var port = process.env.PORT || 8000;
var config = require('./config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var Book = require('./models/bookmodel');
var User = require('./models/user');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", expressJwt({secret: config.secret}));

app.use('/auth', require("./routes/authRoutes"));
app.use('/api/books', require("./routes/bookRoutes"))

mongoose.connect(config.database,  function(err){
    if(err) {
        throw err;
    }
    console.log("connected to the database")
});

app.listen(port, function(){
    console.log('Listening on port: ' + port)
})