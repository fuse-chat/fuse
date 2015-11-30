const app_root_path = require('app-root-path').path;
const _ = require('lodash');
const helpers = require(app_root_path + '/helpers/helpers.js');
const shortid = require('shortid');

/**
 * The Message class
 * @type {Object}
 */
var Message = {};

/**
 * Init a message with a body and the sending User
 * Returns the `this` reference to the Message
 * @param  {string} body
 * @param  {User} sender
 * @return {Message}
 */
Message.init = function(body, sender) {
    helpers.assert(!_.isEmpty(body), 'message body cannot be empty');

    this.body = body;
    this.sender = sender;
    this.id = shortid.generate();
    this.timestamp = Date.now();

    return this;
};

module.exports = Message;
