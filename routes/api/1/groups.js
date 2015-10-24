var app_root_path = require('app-root-path').path;
var Group = require(app_root_path + '/models/group.js');
var express = require('express');
var router = express.Router();

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

    // TODO: save group to database here

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

    // TODO: find group by id in database and remove it

    res.send('unimplemented!')
});

module.exports = router;
