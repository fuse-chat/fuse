const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();
const Database = require(app_root_path + '/database');
const passportHelpers = require(app_root_path + '/helpers/passport-functions.js')

const database = Object.create(Database).init();

/** Get group by name. Example: /group/gymnasium */
router.get('/:name', function(req, res) {
    var user = passportHelpers.currentUser(req);

    if (user != null) { // signed-in
        var groupName = req.params.name;
        database.getGroupByName(groupName, function(err, group) {
            if(err) { throw err; }
            
            // If item does not exist, throw a 404
            // TODO: Make this send the error page
            if(!group) {
                res.status(404).send("404 Not found");
                return false;
            }

            var id = group.id;
            database.getAllGroups(function(err, groups) {
                if(err) { throw err; }

                // INFO:nishanths: I did this stupid thing to make it easier to loop over and pick the selected group in .hbs
                // even sadder: this seems to be most straightforward way to do it
                groups.some(function(item) {
                    if (item.id === id) {
                        item.selected = true;
                        return true;
                    }
                });

                res.render('index', { 
                    title: 'Fuse Chat', 
                    groups: groups, 
                    selectedGroup: group, 
                    username: user.name,
                    user: user,
                    bellNotifications: user.bellNotifications.slice().reverse(),
                    preferences: user.preferences
                });
            });
        });
    }

    else {
        res.redirect('/signin');
    }
    
});

module.exports = router;
