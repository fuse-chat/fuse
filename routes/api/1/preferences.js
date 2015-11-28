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
  var currentUser = passportHelpers(req);
  if (currentUser == null) { // not signed-in
    throw new Error('not signed in');
  }

  database.getUserById(currentUser.id, function(err, user) {
    if (err) {
      throw err;
    }

    res.json(user);
  });
});

/**
 * Set the preferences for the logged-in user
 *
 * Request body should have a `preferences` paramater that is a JSON-ified string of the preferences
 * preferences: {!string}
 */
router.post('/', function(req, res) {
  var currentUser = passportHelpers(req);
  if (currentUser == null) { // not signed-in
    throw new Error('not signed in');
  }

  var userId = currentUser.id;
  var preferences = JSON.parse(req.body.preferences);
  database.setPreferencesForUserId(preferences, userId);

  res.json({ok: true});
});


module.exports = router;

