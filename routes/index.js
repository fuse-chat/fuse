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
//used to collect username
var myModule = require(app_root_path + '/functions.js');

//We will be creating these two files shortly
// var config = require('./config.js'), //config file contains all tokens and other private info
//    funct = require('./functions.js'); //funct file contains our helper functions for our Passport and database work


//===============ROUTES=================
//displays our signup page
router.get('/signin', function(req, res){
  res.render('signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', { 
  successRedirect: '/',
  failureRedirect: '/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});

// TODO: cleanup
/* GET home page. */
router.get('/', function(req, res, next) {
    database.getAllGroups(function(err, items) {
        if (err) {
            throw err;
        }
        //the username of logfed in user
        var name1 = myModule.name;

        // set the first one to be the selected one
        items[0].selected = true;
        res.render('index', { title: 'Fuse Chat', groups: items, selectedGroup: items[0], username: name1});
    });
});

module.exports = router;
