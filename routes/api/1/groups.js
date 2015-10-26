const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');


/**
 * Get all groups
 */
router.get('/', function(req, res) {
    groupsdb.find().toArray(function(err, items) {
        if (err) {
            throw err;
        }

        res.json(items);
    });
});

/**
 * Get group by name
 */
router.get('/:name', function(req, res) {
    var name = req.params.name;
    groupsdb.findOne({name: name}, function(err, item) {
        if (err) {
            throw err;
        }

        res.json(item);
    });
});

/**
 * Create a group
 * 
 * Request body should have a `name` paramater; the other parameters are optional
 * name: {!string}
 * description: {string}
 */
router.post('/', function(req, res) {
    var name = req.body.name;
    var description = req.body.description;

    // TODO: check name uniqueness against database
    // and reject if exists. Discussion needed on what the frontend expects on error

    var group = Object.create(Group).init(name, description);

    // save group to database here
	groupsdb.insert(group, function(err, result) {
	    if (err) {
            throw err;
        }

	    if (result) {
            req.io.sockets.emit(defines['socket-group-created'], result.ops[0]);
            res.json(result);
        }
	});
});

/**
 * Delete a group
 * 
 * Request body should have a `id` parameter.
 * name: {!string}
 */
router.delete('/', function(req, res) {
    var id = req.body.id;

    // find group by id in database and remove it
	groupsdb.remove({id: id}, function(err, result) {
	    if (err) {
            throw err;
        }

        if (result) {
            req.io.sockets.emit(defines['socket-group-deleted'], result.ops[0]);
            res.json(result);
        }
	});
});

module.exports = router;
