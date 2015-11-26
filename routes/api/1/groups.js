const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Database = require(app_root_path + '/database');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();

var database = Object.create(Database).init();


/**
 * Get all groups
 */
router.get('/', function(req, res) {
  database.getAllGroups(function(err, groups) {
    if(err) { throw err; }
    res.json(groups);
  });
});

/**
 * Get group by name
 */
router.get('/:name', function(req, res) {
    var name = req.params.name;
    database.getGroupByName(name, function(err, group) {
      if(err) { throw err; }
      res.json(group);
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
  var position = req.body.position;

  // TODO: check name uniqueness against database
  // and reject if exists. Discussion needed on what the frontend expects on error

  var group = Object.create(Group).init(name, description, position);
  // save group to database here
  database.addGroup(group, function(err, result) {
    if(err) { throw err; }
    if(result) {
      req.io.sockets.emit(defines['socket-group-created'], result);
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
    database.deleteGroupById(id, function(err, result){
      if (err) { throw err; }
      if (result) {
          req.io.sockets.emit(defines['socket-group-deleted'], result.ops[0]);
          res.json(result);
      }
    });
});

module.exports = router;
