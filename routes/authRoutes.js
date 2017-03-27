var express = require('express');
var authRoutes = express.Router();
var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');
var async = require('async');
var crypto = require('crypto');


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

authRoutes.post('/forgot', function(req, res) {
    async.waterfall([
        //generate random string
        function(done) {
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token)
            })
        },
        //find the user and update password Token
        function(token, done) {
            User.findOne({email: req.body.email}, function(err, user){
                if(err) return done(err);
                else if(!user) return res.status(404).send({
                    success: false, message: "The email " + req.body.email + " isn't in the system."
                });
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save(function(err){
                    if(err) return done(err);
                    done(null, token, user)
                });
            });
        },
        //send the email
        function(token, user, done) {
            var helper = require('sendgrid').mail;
            var fromEmail = new helper.Email("noreply@booklist.cash")
            var toEmail = new helper.Email(user.email);
            var subject = "Your BookList password reset link";
            //this can be text/html for a nice looking email
            var content = new helper.Content("text/plain", 'You are receiving this because you (or someone else) ' +
                'have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n');
            var mail = new helper.Mail(fromEmail, subject, toEmail, content);
            var sendgrid = require('sendgrid')(config.sendgridAPIkey);
            var request = sendgrid.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });
            sendgrid.API(request, function(err, response){
                if(err) return done(err);
                done(null, "Finally Done, email sent!")
            })
        }
        ],
        function(err, result) {
            if (err) return res.status(500).send(err);
            res.status(200).send({success: true, message: "Mail sent successfully!"})
        })
})

authRoutes.post('/reset', function(req, res){
    User.findOne({resetPasswordToken: req.body.resetToken}, function(err, user){
        if(err) return res.status(500).send(err);
        if(!user) return res.status(404).send({message: "Invalid reset token", success: false});
        var now = Date.now();
        if(now > user.resetPasswordExpires) return res.status(418).send({success: false, message: "Password reset token has expired!"})
        user.password = req.body.password || user.password;
        delete user.resetPasswordExpires;
        delete user.resetPasswordToken;
        user.save(function(err){
            if(err) return res.status(500).send(err)
            res.send({success: true, message: "Password Successfully changed"})
        })

    })
})

module.exports = authRoutes;