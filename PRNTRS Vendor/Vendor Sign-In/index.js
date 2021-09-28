const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
require("./passport.js")

app.use(cors())

app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieSession({
    name: 'test-session',
    keys: ['key1', 'key2']
}))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.render('index.html'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))
app.get('/good', isLoggedIn, (req, res) => res.render('vendorindex.html'))

app.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email ']
    }));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect good.
        res.redirect('/good');
    });

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})
app.listen(3000, () => console.log(`Example app listening on port ${3000}!`))