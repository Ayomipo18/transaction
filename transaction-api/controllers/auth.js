const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const dotenv = require('dotenv');

dotenv.config();
const isUserNameTaken = (req, res, next) => {
    User.findOne({username : req.body.username}, (err, user)=> {
        if(err || !user){
            return next()
        }
        else{
            return res.status(403).json({
                error : "Username is taken"
            })
        }
    });
}

const signUp = (req, res) => {
    User.findOne({email : req.body.email}, (err, user)=> {
        if(err || !user){
            const newUser = new User(req.body);
            newUser.save((error, saved) => {
                if(error) return res.status(403).json({error})
                else if(saved) {
                    return res.status(200).json({ message : "Sign up successful. Please login" });
                }
            })
        }
        else{
            return res.status(403).json({
                error : "Email is already registered"
            })
        }
    });
};

const signIn = (req, res) => {
    //find the user based on email
    const { username, password } = req.body;
    User.findOne({username}, (err, user) => {
        //if err or no user
        if(err || !user) {
            return res.status(401).json({
                error : "User with that username does not exist. Please sign up"
            })
        }
        //if user is found, make sure the email and password match
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error : "Username and password do not match"
            }) 
        }

        //if user is found, authenticate
        //generate a token with user id and secret
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn : 3000000});
    
        //return response with user and token to frontend client
        const { _id, name, email, username, balance } = user;
        return res.json({token, user : {_id, email, name, username, balance}});
    })
    
}

const getUsers = (req, res) => {
    User.find().select('username balance joined email')
    .then(users => {
        res.json({ users });
    })
    .catch(err => console.log(err))
}

const tokenValid = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error :'Session expired, please relogin'});
    }
    next();
}
const requireSignIn = expressJwt({
    //if token is valid, express jwt appends the verified users id in an auth key to the request object
    secret : process.env.JWT_SECRET,
    userProperty : "auth"
});

const confirmUser = (req, res, next) => {
    User.findById(req.body.user)
    .exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "Authentication error, please relogin and try again"
            })
        }
        req.profile = user; // adds profile object in req with user info
        next();
    })
}

const hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!authorized) {
        return res.status(403).json({
            error : "User is not authorized to perform this action"
        })
    }
    next()
}

module.exports = { signUp, signIn, requireSignIn, tokenValid, confirmUser, hasAuthorization, isUserNameTaken, getUsers };