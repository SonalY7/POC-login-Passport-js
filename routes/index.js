const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => res.render('home'));
router.get('/dashboard', (req, res) => {
    // authenticating access put on hold.. isAuthenticated() returning false for GoogleStrategy unlike for LocalStrategy
    console.log(req.isAuthenticated());
    res.render('dashboard');});

module.exports = router;
