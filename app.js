const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

mongoose.promise = global.Promise;

const app = express();
require('./config/passport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'AoHaru',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


mongoose.connect('mongodb://localhost/passport-poc', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'));


require('./models/Users');

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
