// client side
// preferences.js
// - handle ui/data for input and changes of user preferences
// - keep user preferences in sync with the server

// TODO

var Pref = {};

defines['preferences-url-base'] = `/api/${defines.API_VERSION}/preferences`;

Pref.NOTIFICATION_NODE_SELECTOR = ".modal#fc-preferences .fc-preferences-notifications";
Pref.HOTWORDS_NODE_SELECTOR = ".modal#fc-preferences .fc-preferences-hotwords";

/**
 * @return {boolean}
 */
Pref.isNotificationsEnabled = function() {
    var notificationCheckBox = document.querySelector(Pref.NOTIFICATION_NODE_SELECTOR);
    return notificationCheckBox.checked;
};

/**
 * Returns a set of the user's hotwords
 * @return {Set<string>}
 */
Pref.hotwords = function() {
    var hotwordsBox = document.querySelector(Pref.HOTWORDS_NODE_SELECTOR);
    return new Set(hotwordsBox.value.split(',').map(s => s.trim()));
};

Pref.updateLocal = function(preferences) {
    var notificationCheckBox = document.querySelector(Pref.NOTIFICATION_NODE_SELECTOR);
    var hotwordsBox = document.querySelector(Pref.HOTWORDS_NODE_SELECTOR);
    notificationCheckBox.checked = preferences.notifications;
    hotwordsBox.value = preferences.hotwords.join(', ');
};

Pref.fetchFromServer = function(fn) {
    $.get(defines['preferences-url-base'], fn);
};

Pref.saveToServer = function(preferences, opt_fn) {
    var defaultPreferencesParams = { notifications: false, hotwords: [] };
    preferences = toolbelt.normalize(preferences, defaultPreferencesParams);
    $.post(defines['preferences-url-base'], {preferences: preferences}, opt_fn || function(res) {
        console.log('successfully updated preferences', res);
    });
};

Pref.handleCancel = function() {
    Pref.fetchFromServer(function(res) {
        Pref.updateLocal(res);
    });
};

Pref.handleSave = function() {
    var notificationCheckBox = document.querySelector(Pref.NOTIFICATION_NODE_SELECTOR);
    var hotwordsBox = document.querySelector(Pref.HOTWORDS_NODE_SELECTOR);
    var preferences = {
        notifications: notificationCheckBox.checked,
        hotwords: hotwordsBox.value.split(',').map(s => s.trim())
    };

    Pref.saveToServer(preferences, function() {
        Pref.updateLocal(preferences);
    });
};

window.addEventListener('load', function() {
    var saveButton = document.querySelector('.modal#fc-preferences .fc-preferences-save');
    var cancelButton = document.querySelector('.modal#fc-preferences .fc-preferences-cancel');

    saveButton.addEventListener('click', function() {
        Pref.handleSave();
    });

    cancelButton.addEventListener('click', function() {
        Pref.handleCancel();
    });
});
