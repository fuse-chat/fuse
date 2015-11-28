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
    this.hotwords = [];
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

    h.forEach(function(hotword) {
        if (this.hotwords.indexOf(hotword) === -1) {
            this.hotwords.push(hotword);        
        }
    });
};

/**
 * Remove a single hotword or array of hotwords
 * @param {string|Array<string>} h
 */
Preferences.removeHotword = function(h) {
    if (!Array.isArray(h)) {
        h = [h];
    }

    h.forEach(function(hotword) {
        var idx = this.hotwords.indexOf(hotword);
        if (idx !== -1) {
            this.hotwords.splice(idx, 1);
        }
    });
};

module.exports = Preferences;
