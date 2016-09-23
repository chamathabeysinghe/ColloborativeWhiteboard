var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var workspace = require('./routes/workspace')
var app = express();
var passport = require('passport'),
    util = require('util'),
    FacebookStrategy = require('passport-facebook').Strategy,
    session = require('express-session'),
    methodOverride = require('method-override');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var config = require('./config');
var fb = require('fb');
var User = require('./model/user');
var FACEBOOK_APP_ID = "959299700862684";
var FACEBOOK_APP_SECRET = "24d1d6a2d3172e308bfa2c2069f577bd";



app.config = config;
//setup mongoose
app.db = mongoose.connect(config.mongodb.uri);
//self.app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
autoIncrement.initialize(app.db);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.cryptoKey,
    store: new mongoStore({
        url: config.mongodb.uri
    })
}));


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(
    new FacebookStrategy({
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            //callbackURL: "http://" + self.ipaddress + ":" + self.port + "/auth/facebook/callback/:id",
            profileFields: ['id', 'displayName', 'email', 'picture.height(125).width(125)', 'gender']
        },
        function (token, refreshToken, profile, done) {

            process.nextTick(function () {
                console.log(profile);
                var mail = ' ';
                if (profile.hasOwnProperty('emails')) {
                    mail = profile.emails[0].value;
                }
                User.findByEmailOrQuery(mail, {
                    'facebook.id': profile.id
                }, function (err, user) {

                    if (err); //return done(err);

                    if (!user) {
                        var user = new User();
                    }

                    user.facebook.id = profile.id;
                    user.facebook.token = token;
                    user.facebook.name = profile.displayName;
                    if (profile.hasOwnProperty('emails')) {
                        user.email = profile.emails[0].value;
                    }
                    user.save(function (err) {
                        if (err) throw err;
                        return done(null, profile);
                    });
                });

            });


        })
);


app.use('/', routes);
app.use('/users', users);
app.use('/workspace', workspace);
app.get('/auth/facebook/:id/', function (req, res, next) {
    passport.authenticate(
        'facebook',
        {
            callbackURL: '/auth/facebook/login_callback/' + req.params.id,
            scope: ['user_friends', 'email']
        }
    )(req, res, next);
});

app.get('/auth/facebook/login_callback/:id', function (req, res, next) {
    passport.authenticate(
        'facebook',
        {
            callbackURL: "/auth/facebook/login_callback/" + req.params.id
            , successRedirect: "/" + req.params.id + "/"
            , failureRedirect: "/",
            scope: ['user_friends', 'email']
        }
    )(req, res, next);
});

app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
