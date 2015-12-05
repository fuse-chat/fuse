const app_root_path = require('app-root-path').path;
var request = require("supertest");
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');
const usersdb = db.collection('user');
var base_url = "http://localhost:3000";
var server = request.agent(base_url);
const User = require(app_root_path + '/models/user.js');
const preferences_route = '/api/1/preferences';

describe("Preferences Route Unit Tests",function(){
  var nonexistentUserNameSignIn = "THISNameSUCK$HopefullyItIs Not~ Taken for sign in!!@notarealuser.com";

  describe("Tests without logging in", function() {
    it("Test get without logging in",function(done){
      var pathname = preferences_route;
      var req = request(base_url).get(pathname);
      req.expect(403, done) // Fails because not logged in
    });

    it("Test post without logging in",function(done){
      var pathname = preferences_route;
      var req = request(base_url).get(pathname);
      req.expect(403, done) // Fails because not logged in
    });
  });

  describe("Tests with logging in", function() {
    var nonexistentUserNamePref = "THISNameSUCK$HopefullyItIs Not~ Taken for preferences!!@notarealuser.com";
    var pass = "password";
    var preferences = {
      notifications: false,
      hotwords: ['hello']
    };

    // Login
    before(function(done) {
      var pathname = "/local-reg";
      server
      .post(pathname).send({username: nonexistentUserNamePref, password: pass})
      .end(function(err, result) {
        if(err) done(err);
        done();
      });
    });

    it("Test post with user login", function(done) {
      var pathname = preferences_route;
      server
      .post(pathname)
      .send({preferences: preferences})
      .expect(200)
      .end(function(err, result) {
        if(err) done(err);
        // Check that it is in the database
        usersdb.find({name: nonexistentUserNamePref }).toArray(function(err, result) {
          user_pref = result[0].preferences;
          expect(result[0].preferences).to.eql(preferences);
          done();
        });
      });
    });

    it("Test get with user login", function(done) {
      var pathname = preferences_route;
      server.get(pathname)
      .expect(200) // Fails because not logged in
      .end(function(err, result) {
        if(err) done(err);
        expect(result.body).to.eql(preferences);
        done();
      });
    });

    // Remove user from database
    after(function(done) {
      usersdb.remove({name: nonexistentUserNamePref}, function(err, result) {
        done();
      });
    });
  });
});
