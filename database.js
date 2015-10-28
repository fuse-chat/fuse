const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');

const mongo = require('mongoskin');
const groupsdb = db.collection('groups');

/**
 * A Database Adaptor
 * Need to decide if we should use a
 * Singleton Pattern for the database as well.
 */
var Database = {};

/**
 * Initialize so it has a connectin to the database
 */
Database.init = function() {
  this.database = mongo.db('mongodb://localhost:27017/fuse');
  this.groupsdb = database.collection('group');
};

/**
 * Get a group by name
 * @param {string} name
 */
Database.getGroupByName = function(name) {
  return this.groupsdb.findOne({name: name});
}

/**
 * Get group by id
 * @param {id} id
 */
Database.getGroupByID = function(id) {
  return this.groupsdb.findOne({id: id});
}

/**
 * Add the given group to the database
 * @param {Group} group
 * @return {Boolean} true if success, false if fail
 */
Database.addGroup = function(group) {
  success = false;
  groupsdb.insert(group, function(err, result) {
    if (err) { throw err; }
    if (result) { success = true; }
  });
  return success;
}

/**
 * Return all groups
 */
Database.getGroups = function() {
  return this.groupsdb.find().toArray();
}

/**
 * Remove group from database
 * @param {Group} group
 */
Database.deleteGroup = function(group) {
  success = false;
  groupsdb.remove({id: group.id}, function(err, result) {
    if (err) { throw err; }
    if (result) { success = true; }
  });

  return success;
}

/**
 * Remove group from database by id
 * @param {id} groupId
 */
Database.deleteGroupById = function(groupId) {
  success = false;
  groupsdb.remove({id: groupId}, function(err, result) {
    if (err) { throw err; }
    if (result) { success = true; }
  });

  return success;
}

/**
 * Remove group from database by name
 * @param {string} groupName
 */
Database.deleteGroupById = function(groupName) {
  success = false;
  groupsdb.remove({name: groupName}, function(err, result) {
    if (err) { throw err; }
    if (result) { success = true; }
  });

  return success;
}

/**
 * Adds the message to the given group
 * @param {Message} message
 * @param {Group} group
 */
Database.addMessageTogroup(message, group) {
  this.groupsdb.update({id: group.id}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
}

/**
 * Adds the message to the given group by its id
 * @param {Message} message
 * @param {id} groupId
 */
Database.addMessageTogroupById(message, groupId) {
  this.groupsdb.update({id: id}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
}

/**
 * Adds the message to the given group by its name
 * @param {Message} message
 * @param {string} groupName
 */
Database.addMessageTogroupByName(message, groupName) {
  this.groupsdb.update({name: groupName}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
}

module.exports = Database;
