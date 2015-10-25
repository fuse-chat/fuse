var app_root_path = require('app-root-path').path;
var Group = require(app_root_path + '/models/group.js');
var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
var db = mongo.db('mongodb://localhost:27017/fuse');
var groupsdb = db.collection('groups');

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
	    if (err) throw err;
	    if (result) console.log('Added!');
	});

    res.send('unimplemented!');
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
	    if (!err) console.log('Deleted!');
	});

    res.send('unimplemented!')
});

module.exports = router;
