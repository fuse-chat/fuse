const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

// TODO: cleanup
// get the group id, given the name
// for that item set the `selected` key
// then send all items so they can be used for the `selected` attribute
router.get('/:name', function(req, res) {
    var groupName = req.params.name;
    
    groupsdb.findOne({name: groupName}, function(err, item) {
        if (err) {
            throw err;
        }

        // If item does not exist, throw a 404
        // TODO: Make this send the error page
        if(!item) {
          res.status(404).send("Not found");
          return false;
        }

        var id = item.id;

        groupsdb.find().toArray(function(err, items) {
            if (err) {
                throw err;
            }

            var selectedGroup = null;

            items.some(function(item) {
                if (item.id === id) {
                    selectedGroup = item;
                    item.selected = true;
                    return true;
                }
            });

            res.render('index', { title: 'Fuse Chat', groups: items, selectedGroup: selectedGroup });
        });
    });
});

module.exports = router;
