var express = require('express');
var router = express.Router();

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

// TODO: cleanup
/* GET home page. */
router.get('/', function(req, res, next) {
    groupsdb.find().toArray(function(err, items) {
        if (err) {
            throw err;
        }

        // set the first one to be the selected one
        items[0].selected = true;

        res.render('index', { title: 'Fuse Chat', groups: items, selectedGroup: items[0] });
    });
});

module.exports = router;
