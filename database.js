const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Message = require(app_root_path + '/models/message.js');

const mongo = require('mongoskin');

/**
 * A Database Adaptor
 * TODO: Need to decide if we should use a
 * Singleton Pattern for the database as well.
 */
var Database = {};

/**
 * Initialize so it has a connectin to the database
 */
Database.init = function() {
  this.database = mongo.db('mongodb://localhost:27017/fuse');
  this.groupsdb = this.database.collection('groups');
  this.userdb = this.database.collection('user');
  return this;
};

/**
 * Get a group by name and perform the callback on it.
 * @param {string} name
 * @param {function} callback
 */
Database.getGroupByName = function(name, callback) {
  return this.groupsdb.findOne({name: name}, callback);
};

/**
 * Get group by id and perform the callback on it
 * @param {id} id
 * @param {function} callback
 */
Database.getGroupByID = function(id, callback) {
  return this.groupsdb.findOne({id: id}, callback);
};

/**
 * Add the given group to the databas and perform the callback on it
 * @param {Group} group
 */
Database.addGroup = function(group, callback) {
  return this.groupsdb.insert(group, function(err, result) {
    if(result) { callback(err, result.ops[0]); }
    else { callback(err, result); }
  });
};

/**
 * Run the given function on the groups
 * Note the callback function should take an err
 * the groups
 * @param {function} callback
 */
Database.getAllGroups = function(callback) {
  return this.groupsdb.find().toArray(callback);
};

/**
 * Remove group from database
 * @param {Group} group
 * @param {function} callback
 */
Database.deleteGroup = function(group, callback) {
  return this.groupsdb.remove({id: group.id}, callback);
};

/**
 * Remove group from database by id
 * @param {id} groupId
 * @param {function} callback
 */
Database.deleteGroupById = function(groupId, callback) {
  return this.groupsdb.remove({id: groupId}, callback);
};

/**
 * Remove group from database by name
 * @param {string} groupName
 * @param {function} callback
 */
Database.deleteGroupById = function(groupName, callback) {
  this.groupsdb.remove({name: groupName}, callback);
};

/**
 * Adds the message to the given group
 * @param {Message} message
 * @param {Group} group
 */
Database.addMessageToGroup = function(message, group) {
  this.groupsdb.update({id: group.id}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
};

/**
 * Adds the message to the given group by its id
 * @param {Message} message
 * @param {id} groupId
 */
Database.addMessageToGroupById = function(message, groupId) {
  this.groupsdb.update({id: groupId}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
};

/**
 * Adds the message to the given group by its name
 * @param {Message} message
 * @param {string} groupName
 */
Database.addMessageToGroupByName = function(message, groupName) {
  this.groupsdb.update({name: groupName}, {'$push':{messages:message}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
};

/**
 * Get the user by user id. The callback receives the result of the operation.
 * @param  {string}   userId
 * @param  {Function} callback
 */
Database.getUserById = function(userId, callback) {
  this.userdb.findOne({id: userId}, callback);
};

/**
 * Set the preferences for the user id
 * @param {Preferences} preferences
 * @param {string} userId
 */
Database.setPreferencesForUserId = function(preferences, userId) {
  this.userdb.update({id: userId}, {'$set': {preferences: preferences}}, function(err, item) {
    if (err) {
      throw err;
    }
  });
};

module.exports = Database;
