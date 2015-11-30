const shortid = require('shortid');
const Preferences = require('./preferences.js');


/**
 * The User class
 * @type {Object}
 */
var User = {};

User.defaultPhotoUrls = [
    'http://41.media.tumblr.com/18a5ac1fc70360ea1b2ef476ec9f15f2/tumblr_mgblfiaRi21qarlxmo1_400.png',
    'http://40.media.tumblr.com/tumblr_m7ewnvaUHv1qarlxmo1_400.jpg',
    'http://41.media.tumblr.com/tumblr_m96ozuvFIL1qarlxmo1_400.jpg',
    'http://36.media.tumblr.com/4ba8f110d5162e8c695abcb7fe286622/tumblr_nd6ln9QO581qarlxmo1_500.jpg',
    'http://40.media.tumblr.com/89e717391eb7033e4e7708d1cc9605ac/tumblr_nls4guWs3m1qarlxmo1_400.jpg'
];

/**
 * Initialize a User object
 * Auto-generates a unique id
 * 
 * Returns `this` reference to the User object
 * @return {User}
 */
User.init = function(username, password) {
    this.name = username;
    this.id = shortid.generate();
    this.password = password; 
    this.preferences = Object.create(Preferences).init();
    this.bellNotifications = [];
    this.photoUrl = User.defaultPhotoUrls[Math.floor(Math.random()*4)];
    return this;
};

module.exports = User;
