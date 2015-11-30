const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();
const Database = require(app_root_path + '/database');
const passportHelpers = require(app_root_path + '/helpers/passport-functions.js')

const database = Object.create(Database).init();

// TODO: cleanup
// get the group id, given the name
// for that item set the `selected` key
// then send all items so they can be used for the `selected` attribute
router.get('/:name', function(req, res) {
    var groupName = req.params.name;
    database.getGroupByName(groupName, function(err, group) {
        if(err) { throw err; }
        
        // If item does not exist, throw a 404
        // TODO: Make this send the error page
        if(!group) {
            res.status(404).send("Not found");
            return false;
        }

        var id = group.id;
        database.getAllGroups(function(err, groups) {
            if(err) { throw err; }
            
            var selectedGroup = null;
            groups.some(function(item) {
                if (item.id === id) {
                    selectedGroup = item;
                    item.selected = true;
                    return true;
                }
            });

            var username;      
            var currentUser = passportHelpers.currentUser(req);

            if (currentUser == null) {
                res.redirect('/signin');
                return;
            }

            username = currentUser.name;

            res.render('index', { 
                title: 'Fuse Chat', 
                groups: groups, 
                selectedGroup: selectedGroup, 
                username: username,
                user: currentUser,
                preferences: currentUser && currentUser.preferences
            });
        });
    });
});

module.exports = router;
