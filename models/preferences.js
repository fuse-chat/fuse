const app_root_path = require('app-root-path').path;

/**
 * The Preferences class
 */
var Preferences = {};

/**
 * Initializes preferences to "zero" values
 * @return {Preferences}
 */
Preferences.init = function() {
    this.hotwords = new Set();
    this.notifications = false;
    return this;
};

/**
 * Add a single hotword or array of hotwords
 * @param {string|Array<string>} h
 */
Preferences.addHotword = function(h) {
    if (!Array.isArray(h)) {
        h = [h];
    }

    Set.prototype.add.apply(this.hotwords, h);
};

/**
 * Remove a single hotword or array of hotwords
 * @param {string|Array<string>} h
 */
Preferences.removeHotword = function(h) {
    if (!Array.isArray(h)) {
        h = [h];
    }

    Set.prototype.delete.apply(this.hotwords, h);
};

Preferences.toJSON = function() {
    return {
        notifications: this.notifications,
        hotwords: Array.from(this.hotwords)
    };
};

module.exports = Preferences;
