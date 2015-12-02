const express = require('express');
const router = express.Router();
const app_root_path = require('app-root-path').path;
const Database = require(app_root_path + '/database');
var util = require('util');
const bcrypt = require('bcryptjs');
const database = Object.create(Database).init();
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const TwitterStrategy = require('passport-twitter');
const GoogleStrategy = require('passport-google');
const FacebookStrategy = require('passport-facebook');
const passportHelpers = require(app_root_path + '/helpers/passport-functions.js');

//===============ROUTES=================
// displays our sign-in/sign-up page
router.get('/signin', function(req, res){
	res.render('signin', {
        title: 'Sign in to Fuse Chat',
        layout: 'layouts/signin'
    });
});

router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/login'
}));

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', { 
    successRedirect: '/',
    failureRedirect: '/signin'
}));

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function (req, res) {
	req.logOut();
	req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

router.get('/auth/facebook', function(req,res){
    res.render('facebookSignin');
});

router.get('/postSignIn', function(req, res, next) {
    req.body.username = req.query.id;
    req.body.password = req.query.pass;
  passport.authenticate('facebook-signin', function(err, user, info) {
    if (err) { 
        return next(err); }
    if (!user) { 
        return res.redirect('/signin'); }
    req.logIn(user, function(err) {
      if (err) { 
        return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

// GET home page.
// - If the user is signed in, show all the groups
// - Redirect to sign in the user
router.get('/', function(req, res, next) {
    var user = passportHelpers.currentUser(req);

    if (user != null) { // signed-in
        console.log('main route: signed in', req.session.passport.user);

        database.getAllGroups(function(err, items) {
            if (err) {
                throw err;
            }

            // set the first one to be the selected one if it exists
            if (items[0]) {
                items[0].selected = true;
            }

            res.render('index', {
                title: 'Fuse Chat', 
                groups: items, 
                selectedGroup: items[0],
                username: user.name,
                user: user,
                bellNotifications: user.bellNotifications.slice().reverse(),
                preferences: user.preferences
            });
        });
    } 

    else {
        console.log('main route: not signed in');
        res.redirect('/signin');
    }
});

module.exports = router;
