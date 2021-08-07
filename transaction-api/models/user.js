const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type: String,
        required : true
    },
    balance : {
        type : Number,
        default : 1000
    },
    hashed_password :String, 
    salt : String,
    joined : {
        type: Date,
        default : Date.now
    },
    resetPasswordToken : String,
    resetExpires : Date
});

userSchema.virtual('password')
.set(function(password) {
    //create temporary variable called _password
    this._password = password
    //generate a timestamp
    this.salt = uuidv1()
    //encryptPassword
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//methods
userSchema.methods = {
    authenticate : function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword : function(password) {
        if(!password) return "";
        try {
           return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex');
        } catch(err) {
            return ""
        }
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;