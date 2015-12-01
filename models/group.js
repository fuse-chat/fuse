const app_root_path = require('app-root-path').path;
const _ = require('lodash');
const shortid = require('shortid');
const helpers = require(app_root_path + '/helpers/helpers.js');
const PositionFunctions = require(app_root_path + '/public/javascripts/positionfunctions');

/**
 * The Group class
 */
var Group = {};

/**
 * Initialize with a name and a description for the group.
 * Auto-generates a unique id.
 * Returns the `this` reference to the Group object.
 * @param  {!string} name
 * @param  {string} description
 * @param  {Position} position
 * @return {Group}
 */
Group.init = function(name, description, position) {
    helpers.assert(!_.isEmpty(name), 'group name should not be empty');

    this.name = name;
    this.description = description;

    this.userMap = new Map();
    this.messages = [];
    this.groupCreator = null; // TODO: once we have login and user identification support
    this.position = position;

    this.timestamp = Date.now();

    this.id = shortid.generate();

    return this;
};

/**
 * Returns the position this group was created at
 * @return {Position}
 */
Group.getPosition = function() {
  return this.position;
}


/**
 * Returns the list of users ids as an array
 * @return {Array<string>}
 */
Group.getUserIds = function() {
    return [...this.userMap.keys()];
};

/**
 * Return the list of users as an array
 * @return {Array<User>}
 */
Group.getUsers = function() {
    return [...this.userMap.values()];
};

/**
 * Add a single user or an array of users to the group
 * @param {User|Array<User>} users
 */
Group.addUsers = function(users) {
    if (!Array.isArray(users)) {
        users = [users]
    }

    users.filter(function(user) {
        return !this.userMap.has(user.id);
    }).forEach(function(user) {
        this.userMap.set(user.id, user);
    });
};

/**
 * Adds a single Message or an array of Messages to the group
 * Returns the number of messages added
 * @param {Message|Array<Message>} messages
 * @return {number}
 */
Group.addMessages = function(messages) {
    if (!Array.isArray(messages)) {
        messages = [messages];
    }

    return Array.prototype.push.apply(this.messages, messages);
};

/**
 * Finds and returns the distance from the group to the
 * input position. Returns distance in kilometers.
 * @param {Position} position
 * @return {number}
 */
Group.distanceInKmFrom = function(position) {
  return PositionFunctions.distanceInKmBetween(group.position, position);
};

/**
 * Finds and returns the distance from the group to the
 * input position
 */
Group.distanceInMilesFrom = function(position) {
  return PositionFunctions.distanceInMilesBetween(group.position, position);
};



// See `toJSON()` section at:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
// Might be useful in the steps leading up storing into database
// That is, we only need to store the ids of the users in this group into the db, not the User objects themselves
Group.toJSON = function() {
    return {
        name: this.name,
        description: this.description,
        userIds: this.getUserIds(),
        position: this.position,
        messages: this.messages,
        users: this.getUsers(),
        id: this.id
    };
};

module.exports = Group;
