const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const keys = require('./keys');

const GoogleUser = require('../models/GoogleUser');
const User = require('../models/Users');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if(!user) {
                        return done(null, false, { message: 'Email is not registered' });
                    }

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;

                        if(isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'Passwords unmatched'});
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
      GoogleUser.findById(id, function(err, user) {
        done(err, user);
      });
    });

    passport.use(
        new GoogleStrategy({
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: keys.google.callbackURL,
    },
        function (accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                GoogleUser.findOne({
                    'email': profile.emails[0].value
                }, function(err, user){
                    if(err)
                        return done(err);
                    if(user) {
                        return done(null, user);
                    }
                    else {
                        let newUser = new GoogleUser({

                        });
                        newUser.id = profile.id;
                        newUser.token = accessToken;
                        newUser.refreshToken = refreshToken;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if(err) throw err;

                            return done(null, newUser);
                        });
                    }
                })
            })
        }));
}
