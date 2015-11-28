const shortid = require('shortid');
const Preferences = require('./preferences.js');

/**
 * The User class
 * @type {Object}
 */
var User = {};

/**
 * Initialize a User object
 * Auto-generates a unique id
 * 
 * Returns `this` reference to the User object
 * @return {User}
 */
User.init = function(username, password) {
    // TODO: add photo url?
    this.name = username;
    this.id = shortid.generate();
    this.password = password; 
    this.preferences = Object.create(Preferences).init();
    return this;
};

User.toJSON = function() {
    return this; // default implementation for now
};

module.exports = User;
