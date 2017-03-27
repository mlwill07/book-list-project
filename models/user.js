var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/, 'Please fill a valid email address']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    password: {
        type: String,
        required: true
    },
    readingList: {
        past: [{
            type: Schema.Types.ObjectId,
            ref: "Book"
        }],
        future: [{
            type: Schema.Types.ObjectId,
            ref: "Book"
        }],
        current: [{
            type: Schema.Types.ObjectId,
            ref: "Book"
        }]
    }
});

userSchema.pre('save', function(next){
    var user = this;
    
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function(err, hash){
        if (err) return next(err);
        user.password = hash;
        next();
    });
})

userSchema.methods.checkPassword = function(passwordAttempt, callback) {
    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

userSchema.methods.withoutPassword = function() {
    var user = this.toObject();
    delete user.password
    return user;
}

module.exports = mongoose.model('User', userSchema)