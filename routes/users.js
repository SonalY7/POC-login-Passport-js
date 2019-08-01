const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => res.render('login'));

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', (req, res) => {
    const { name, email, password, repassword } = req.body;
    let errors = [];

    if (!name || !email || !password || !repassword) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != repassword) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('signup', {
            errors,
            name,
            email,
            password,
            repassword
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    errors.push({ msg: 'Email already exists'})
                    res.render('signup', {
                        errors,
                        name,
                        email,
                        password,
                        repassword
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;

                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Successfully signed up, you can log in now')
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'],
    accessType: 'offline', prompt: 'consent' }));


router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect : '/'
    }),
  function (req, res) {
      // console.log(res.req.user);
      res.redirect('/dashboard');

  }
);


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
});


module.exports = router;
