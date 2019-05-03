const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');
const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

module.exports = (passport) =>{
passport.use(new JwtStrategy(options, (jwt_data,done)=>{
        // JWT - data generates data from users.js
        console.log(jwt_data);
        User.findById(jwt_data.id).then(user=>{
            // user has been found ..
            if(user){
                // done(error , user)
                return done(null,user);
            }
            return done(null,false);
        });
    }));
};