const shortid = require('shortid');

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
User.init = function(username) {
    // TODO: once we have login and identification support
    // a user will have a name, email, photo url, etc.
    this.name = username;
    this.id = shortid.generate();
    return this;
};

User.toJSON = function() {
    return this; // default implementation for now
};

module.exports = User;
