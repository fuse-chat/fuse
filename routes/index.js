var express = require('express');
var router = express.Router();
const app_root_path = require('app-root-path').path;
const Database = require(app_root_path + '/database');

var database = Object.create(Database).init();
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

//===============ROUTES=================
// displays our sign-in/sign-up page
router.get('/signin', function(req, res){
    res.render('signin');
});

// sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
}));

// sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', { 
    successRedirect: '/',
    failureRedirect: '/signin'
}));

// logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
    console.log("passport: route: logout: logging out ", req.user);
    var username = req.user.name; // need to capture before calling logout
    req.logout();
    req.session.notice = "You have successfully been logged out " + username + "!";
    res.redirect('/');
});

// TODO: incomplete
// use local sign-in/sign-up instead
router.get('/auth/facebook', function(req,res){
    res.render('facebookSignin');
});
// called from facebooksignin.hbs. uses query string parameter passing
router.get('/postSignIn',function(req, res, next) {
    groupsdb.find().toArray(function(err, items) {
        if (err) {
            throw err;
        }
        
        var name = req.query.id;
        //the username of logfed in user
        
        // set the first one to be the selected one
        //items[0].selected = true;
        res.render('index', { title: 'Fuse Chat', groups: items, selectedGroup: items[0], username: name});
    });
}); 

// GET home page.
// - If the user is signed in, show all the groups
// - Redirect to sign in the user
router.get('/', function(req, res, next) {    
    if (req.session.passport && req.session.passport.user) { // signed-in
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
                username: req.session.passport.user.name
            });
        });
    } 

    else {
        console.log('main route: not signed in');
        res.redirect('/signin');
    }
});

module.exports = router;
