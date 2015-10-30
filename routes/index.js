var express = require('express');
var router = express.Router();
const app_root_path = require('app-root-path').path;
const Database = require(app_root_path + '/database');

var database = Object.create(Database).init();
// TODO: cleanup
/* GET home page. */
router.get('/', function(req, res, next) {
    database.getAllGroups(function(err, items) {
        if (err) {
            throw err;
        }

        // set the first one to be the selected one
        items[0].selected = true;

        res.render('index', { title: 'Fuse Chat', groups: items, selectedGroup: items[0] });
    });
});

module.exports = router;
