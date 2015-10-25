const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const Group = require(app_root_path + '/models/group.js');
const express = require('express');
const router = express.Router();

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

router.get('/:name', function(req, res) {
    var groupName = req.params.name;
    res.render('index');
});

module.exports = router;
