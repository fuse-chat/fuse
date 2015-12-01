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

/** Main app page, same as getting a group, except that we also arb. mark the first group as selected. */
router.get('/', function(req, res, next) {
    var user = passportHelpers.currentUser(req);

    if (user != null) { // signed-in
        console.log('main route: signed in', req.session.passport.user);

        database.getAllGroups(function(err, groups) {
            if (err) {
                throw err;
            }

            // set the first one to be the selected one if it exists
            if (groups[0]) {
                groups[0].selected = true;
            }

            res.render('index', {
                title: 'Fuse Chat', 
                groups: groups, 
                selectedGroup: groups[0],
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
