var express = require('express');
var authRoutes = express.Router();
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');

authRoutes.post('/signup', function(req, res){
    User.find({email: req.body.email}, function(err, existingUser){
        if(err) return res.status(500).send(err);
        if(existingUser.length) return res.send({success: false, message: "This user already exists"});
        
        var newUser = new User(req.body);
        newUser.save(function(err){
            if(err) return res.status(500).send(err);
            res.send({success: true, user: newUser, message: "Successfully created a new user"})
        })
    })
})

authRoutes.post('/login', function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(err) return res.status(500).send(err);
        
        if (!user) {
            return res.status(401).send({success: false, message: "Invalid email address or password"});
        }
        
        user.checkPassword(req.body.password, function(err, isMatch){
            if(err) return res.status(403).send(err);
            if(!isMatch) return res.status(401).send({success: false, message: "Invalid email address or password"});
            var token = jwt.sign(user.toObject(), config.secret, {expiresIn: "24h"});
            res.send({token: token, success: true, user: user.withoutPassword(), message: "Here's your token!"})
        })
        
        
    });
})

module.exports = authRoutes;