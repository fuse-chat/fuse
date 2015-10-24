const app_root_path = require('app-root-path').path;
const _ = require('lodash');
const shortid = require('shortid');
const helpers = require(app_root_path + '/helpers/helpers.js');

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
 * @return {Group}
 */
Group.init = function(name, description) {
    helpers.assert(!_.isEmpty(name), 'group name should not be empty');
    
    this.name = name;
    this.description = description;
    
    this.userMap = new Map();
    this.messages = [];
    this.groupCreator = null; // TODO: once we have login and user identification support

    this.id = shortid.generate();

    return this;
};

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
        return !this.users.has(user.id);
    }).forEach(function(user) {
        this.users.set(user.id, user);
    });
};

/**
 * Adds a single Message or an array of Messages to the group
 * Returns the number of messages added
 * @param {Message|Array<Message>} messages
 * @return {number}
 */
Group.addMessages = function(messages) {
    if (Array.isArray(messages)) {
        messages = [messages];
    }

    return Array.prototype.push.apply(this.messages, messages);
};

// See `toJSON()` section at:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
// Might be useful in the steps leading up storing into database
// That is, we only need to store the ids of the users in this group into the db, not the User objects themselves
Group.toJSON = function() {
    return {
        name: this.name,
        description: this.description,
        usersIds: this.getUserIds()
        // TODO messages and more...
    }
};

module.exports = Group;
