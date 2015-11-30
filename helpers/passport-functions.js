const app_root_path = require('app-root-path').path;
const defines = require(app_root_path + '/defines');
const User = require(app_root_path + '/models/user.js');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Q = require('q');
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const userdb = db.collection('user');

// used in local-signup strategy
exports.localReg = function (username, password) {
    var deferred = Q.defer();
    var hash = bcrypt.hashSync(password, 8);
  
    // check if username is already assigned in our database
    userdb.findOne({ name: username}, function(err, item) {
        if(err) {
            throw err;
        }

        // if item does not exist
        if (!item) {
          console.log("passport: Username not registered:", username);
          
          // insert user into db
          var user = Object.create(User).init(username, hash);
          userdb.insert(user, function(err, result) {
                if (err) {
                    console.log("passport: throwing error");
                    throw err;
                }

                if (result) {
                    deferred.resolve(user);
                }
            });
        }
        
        // if item already exists
        if (item) {
            console.log("passport: Username already exists");
            deferred.resolve(false);
        }
    });
    
    return deferred.promise;
};

// TODO: Local Authorizing
// INFO: Is this still a TODO?
exports.localAuth=function(username, password){
    var deferred = Q.defer();

    userdb.findOne({name: username}, function(err, item){
        if(err){
            throw err;
        }
        
        if (item){
            console.log("passport: FOUND USER");
            var hash = item.password;
            
            // check password match
            if (bcrypt.compareSync(password, hash)) {
                deferred.resolve(item);
            } else {
              deferred.resolve(false);
            }
        }
        if(!item) {
            console.log ("passport: Could not find user in db for signin");
            deferred.resolve(false);
        }
    });

    return deferred.promise;
};

// Extract the current user from a req object
exports.currentUser = function(req) {
    return req.session.passport && req.session.passport.user;
};

