const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

/**
 * Get the all boards, optionally filtered by body params
 */
router.get('/', function(req, res) {
    groupsdb.find().toArray(function(err, items) {
        if (err) {
            throw err;
        }

        res.send(items);
    });
});

/**
 * Get a group by id
 */
router.get('/:id', function(req, res) {
    // `req.params.id` has access the id in the route
    // TODO
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

    // TODO: check name uniqueness against database?

    var group = Object.create(Group).init(name, description);

    // save group to database here
	groupsdb.insert(group, function(err, result) {
	    if (err) {
            throw err;
        }

	    if (result) {
            req.io.sockets.emit('group added', result);
            req.io.emit('chat message', {message: {body: 'nope'}});
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
	groupsdb.remove({_id: id}, function(err, result) { //does not work. Use name instead?
	    if (err) {
            throw err;
        }

        req.io.emit('group deleted', id);
	});

    res.send('unimplemented!')
});

module.exports = router;
