const express = require('express');
const router = express.Router();
const app_root_path = require('app-root-path').path;
const Database = require(app_root_path + '/database');
var util = require('util');

const database = Object.create(Database).init();
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

const passportHelpers = require(app_root_path + '/helpers/passport-functions.js');

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
