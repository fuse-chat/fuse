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
      var user1 = Object.create(User).init(username,hash);
      userdb.insert(user1, function(err, result) {
          if (err) {
            console.log("throwing error");
              throw err;
          }

          if (result) {
            deferred.resolve(user);
            //next two lines are to pass username to routes so that hbs file can use username
            var name = username;
            exports.name = name;
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

  exports.localAuth=function(username, password){
    var deferred = Q.defer();

    userdb.findOne({name: username}, function(err, item){
      if(err){
        throw err;
      }
      if (item){
        console.log("FOUND USER");
        var hash = item.password;
        console.log(hash);
        console.log(bcrypt.compareSync(password, hash));
        if (bcrypt.compareSync(password, hash)) {
          deferred.resolve(item);
          //next two lines are to pass username to routes so that hbs file can use username
          var name = username;
          exports.name = name;

        } 
        else {
          console.log("PASSWORDS NOT MATCH");
          deferred.resolve(false);
        }
      }
      if(!item){
        console.log ("Could not find user in db for signin");
        deferred.resolve(false);
      }
     })
     return deferred.promise;
    };
  
