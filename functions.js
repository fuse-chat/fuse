const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const User = require(app_root_path + '/models/user.js');
const express = require('express');
const router = express.Router();
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const userdb = db.collection('user');

var bcrypt = require('bcryptjs'),
    Q = require('q');
     
//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();
  var hash = bcrypt.hashSync(password, 8);
  var user = {
    "username": username,
    "password": hash,
    "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
  }
  //check if username is already assigned in our database
  userdb.findOne({name: username}, function(err, item){
    if(err) {
      throw err;
    }

    //if item does not exist
    if (!item) {
      console.log("Username not found");
      //insert username into db
      var user1 = Object.create(User).init(username);
      userdb.insert(user1, function(err, result) {
          if (err) {
            console.log("throwing error");
              throw err;
          }

          if (result) {
            deferred.resolve(user);
          }
        });
    }
    // if item already exists
    if (item) {
      console.log("Username already exists");
      deferred.resolve(false);
      
    }

    })
  return deferred.promise;
  };

  // todo: local Authorizing