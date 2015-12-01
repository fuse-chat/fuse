const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Database = require(app_root_path + '/database');
const express = require('express');
const router = express.Router();
const passportHelpers = require(app_root_path + '/helpers/passport-functions.js');

const database = Object.create(Database).init();

/**
 * Get preferences for logged-in user
 */
router.get('/', function(req, res) {
  var user = passportHelpers.currentUser(req);
  
  if (user != null) { // not signed-in
    database.getUserById(user.id, function(err, user) {
        if (err) {
          throw err;
        }

        res.json(user.preferences);
      });
  }

  else {
    res.status(403).send('Access denied');
  }
});

/**
 * Set the preferences for the logged-in user
 *
 * Request body should have a `preferences` paramater that is a JSON-ified string of the preferences.
 * preferences: {!string}
 */
router.post('/', function(req, res) {
  var user = passportHelpers.currentUser(req);
  
  if (user != null) { // not signed-in
    var userId = user.id;
    var preferences = req.body.preferences;
    database.setPreferencesForUserId(preferences, userId);

    res.json({ok: true});
  }

  else {
    res.status(403).send('Access denied');
  }
});


module.exports = router;

