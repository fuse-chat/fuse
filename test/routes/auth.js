const app_root_path = require('app-root-path').path;
var request = require("supertest");
var chai = require('chai');
var should = chai.should;
var expect = chai.expect;
const mongo = require('mongoskin');
const jquery = require('jquery');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');
const usersdb = db.collection('user');
var base_url = "http://localhost:3000";
var server = request.agent(base_url);
var googlePath = "/auth/google"
var facebookPath = "/auth/facebook"
const bcrypt = require('bcryptjs');
const User = require(app_root_path + '/models/user.js');

describe("Authentication Route Unit Tests",function(){
  var nonexistentUserNameSignIn = "THISNameSUCK$HopefullyItIs Not~ Taken for sign in!!@notarealuser.com";
  var nonexistentUserNameDelete = "THISNameSUCK$HopefullyItIs Not~ Taken for deletion!!@notarealuser.com";

  it("Test the " + googlePath + "  url",function(done){
    var pathname = googlePath;
    var req = request(base_url).get(pathname);
    req.expect(302, done) // Redirects to google page
  });

  it("Test the " + facebookPath + " url",function(done){
    var pathname = facebookPath;
    var req = request(base_url).get(pathname);
    req.expect("Content-type",/html/)
       .expect(200, done) // This is HTTP response
  });

  it("Test the /signin url",function(done){
    var pathname = "/signin";
    request(base_url).get(pathname)
    .expect("Content-type",/html/)
    .expect(200, done) // This is HTTP response
  });

  describe("Tests authentication for users that don't exist", function() {
    var nonexistentUserNameSignUp = "THISNameSUCK$HopefullyItIs Not~ Taken for sign up!!@notarealuser.com";
    var nonexistentUserNameSignIn = "THISNameSUCK$HopefullyItIs Not~ Taken for sign in!!@notarealuser.com";
    var pass = "password";

    it("Tests login for user that doesn't exist", function(done) {
      var pathname = '/login';
      request(base_url).post(pathname).send({username: nonexistentUserNameSignIn, password: pass})
      .expect(302)
      .end(function(err, res) {
        // Should redirect to login
        expect(res.header['location']).to.include('signin');
        done();
      });
    });

    it("Tests the user sign up", function(done) {
    var pathname = "/local-reg";
      request(base_url).post(pathname).send({username: nonexistentUserNameSignUp, password: pass})
      .expect(302)
      .end(function(err, res) {
        if(err) done(err);
        expect(res.header['location']).to.not.include('signin');
        // Ensure that the user was added to the db
        usersdb.find({name: nonexistentUserNameSignUp }).toArray(function(err, result) {
          expect(result[0]).to.exist;
          done();
        });
      });
    });

    it("Tests the logout functionality", function(done) {
      var pathname = "/logout"
      request(base_url).get(pathname)
      .expect(302)
      .end(function(err, res) {
        if(err) done(err);
        expect(res.header['location']).to.include('signin');
        done();
      });
    });


    after(function(done) {
      usersdb.remove({name: nonexistentUserNameSignUp}, function(err, result) {
        usersdb.remove({name: nonexistentUserNameSignIn}, function(err, result) {
          done();
        });
      });
    });
  });


  describe("Tests authentication for users that exist", function() {
    var nonexistentUserNameSignUp = "THISNameSUCK$HopefullyItIs Not~ Taken for sign up!!@notarealuser.com";
    var nonexistentUserNameSignIn = "THISNameSUCK$HopefullyItIs Not~ Taken for sign in!!@notarealuser.com";
    var pass = "password";

    before(function(done) {
      var hash = bcrypt.hashSync(pass, 8);
      var user1 = Object.create(User).init(nonexistentUserNameSignUp, hash);
      var user2 = Object.create(User).init(nonexistentUserNameSignIn, hash);
      usersdb.insert([user1, user2], function(err, result) {
        if(err) done(err);
        done();
      });
    });

    it("Tests login for user that exists", function(done) {
      var pathname = '/login';
      request(base_url).post(pathname).send({username: nonexistentUserNameSignIn, password: pass})
      .expect(302)
      .end(function(err, res) {
        // Should redirect to login
        expect(res.header['location']).to.not.include('signin');
        var pathname = "/logout"
        request(base_url).get(pathname)
        .expect(302, done)
      });
    });

    it("Tests the user sign up if name already exists", function(done) {
    var pathname = "/local-reg";
      request(base_url).post(pathname).send({username: nonexistentUserNameSignUp, password: pass})
      .expect(302)
      .end(function(err, res) {
        if(err) done(err);
        expect(res.header['location']).to.include('signin');
        done();
      });
    });

    after(function(done) {
      usersdb.remove({name: nonexistentUserNameSignUp}, function(err, result) {
        usersdb.remove({name: nonexistentUserNameSignIn}, function(err, result) {
          done();
        });
      });
    });
  });
});

