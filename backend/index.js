const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express();
const auth = require('./src/auth');
const articles = require('./src/articles');
const following = require('./src/following');
const profile = require('./src/profile');
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//////
const corsOptions = {
    origin: 'https://fanricebookfinal.surge.sh',
    //origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
};

app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors(corsOptions));
app.enable('trust proxy');

app.use(session({
    secret: 'doNotGuessTheSecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '329392464877-u6h337mfvf6flagp0f156jug05dbk232.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    let user = {
        /*'email': profile.emails[0].value,
        'name' : profile.name.givenName + ' ' + profile.name.familyName,
        'id'   : profile.id,*/
        'token': accessToken
    };
    // You can perform any necessary actions with your user at this point,
    // e.g. internal verification against a users table,
    // creating new user entries, etc.

    return done(null, user);
    // User.findOrCreate(..., function(err, user) {
    //     if (err) { return done(err); }
    //     done(null, user);
    // });
})
);
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login'] })); // could have a passport auth second arg {scope: 'email'}

// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/google/callback',
/*
passport.authenticate('google', { successRedirect: 'http://localhost:3000/main',
failureRedirect: '/auth'}));
*/
passport.authenticate('google', { successRedirect: 'https://fanricebookfinal.surge.sh/main',
failureRedirect: '/'}));

app.get('/', function (req, res) {
    res.send("Welcome to ricebook");
});

auth(app);
articles(app);
following(app);
profile(app);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
     const addr = server.address();
     console.log(`Server listening at http://${addr.address}:${addr.port}`)
});