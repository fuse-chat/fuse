// node module requires
const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');

const defines = require('./defines');

// adding for passport use
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const TwitterStrategy = require('passport-twitter');
// const GoogleStrategy = require('passport-google');
const FacebookStrategy = require('passport-facebook');

const passortHelpers = require('./helpers/passport-functions.js'); // contains our helper functions for our Passport and database work


const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sockets = require('./sockets.js');
const publicDirPath = __dirname + '/public';

// view engine setup - currently uses Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// socket.io events
sockets(io);

// middleware
// see: http://expressjs.com/guide/using-middleware.html
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// added for passport usage
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// sockets middleware
// make the io object available on every req at `req.io`
app.use(function(req, res, next) {
    req.io = io;
    next();
});

// added for passport use
// Session-persisted message middleware
app.use(function(req, res, next){
  var err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

  delete req.session.error;
  delete req.session.success;
  delete req.session.notice;

  if (err) res.locals.error = err;
  if (msg) res.locals.notice = msg;
  if (success) res.locals.success = success;

  next();
});


app.use(lessMiddleware(path.join(publicDirPath)));
app.use(express.static(path.join(publicDirPath)));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//===============PASSPORT=================
// Passport session setup.
passport.serializeUser(function(user, done) {
  // console.log("passport: serializing ", user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // console.log("passport: deserializing ", obj);
  done(null, obj);
});

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    'clientID'      : '403805483120-n9nfegk2jgdget7r6svcmahas1fqkjtr.apps.googleusercontent.com',
    'clientSecret'  : 'mvpV2F8ooNA8RH9dlVQYYVxz',
    'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));
// Use the LocalStrategy within Passport to login/”signin” users.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, // allows us to pass back the request to the callback
  function(req, username, password, done) {
    passortHelpers.localAuth(username, password)
    .then(function (user) {
      if (user) {
        console.log("passport: logged in as: ", user);
        req.session.success = 'You are successfully logged in ' + user.name + '!';
        done(null, user);
      }
      if (!user) {
        console.log("passport: could not login in with username: ", username);
        req.session.error = 'Could not log user in. Please try again.'; // inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err) {
      console.log(err.body);
    });
  }
));

// Use the LocalStrategy within Passport to register/"signup" users.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, // allows us to pass back the request to the callback
  function(req, username, password, done) {
    passortHelpers.localReg(username, password)
    .then(function (user) {
      if (user) {
        console.log("passport: registered: ", user);
        req.session.success = 'You are successfully registered and logged in ' + user.name + '!';
        done(null, user);
      }
      if (!user) {
        console.log("passport: could not register the username: ", username);
        req.session.error = 'That username is already in use, please try a different one.'; // inform user could not log them in
        done(null, user);
      }
    })
    .fail(function (err){
      console.log(err.body);
    });
  }
));


// main routes
app.use('/', require('./routes/index'));
app.use('/group', require('./routes/group'));
app.use('/api/1/groups', require('./routes/api/1/groups'));

// if none of routes above match
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// export app in case other files want to use it
module.exports = app;

var port = process.env.PORT || 3000;

// start the server
http.listen(port, function(){
    console.log('listening on *:' + port);
});
