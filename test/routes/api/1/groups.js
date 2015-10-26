var request = require("supertest");
var should = require("should");

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

var base_url = "http://localhost:3000";
var server = request.agent(base_url);
var base_pathname = "/api/1/groups/";

describe("Group API Unit Tests",function(){
  var groupCreated = false;
  var nonexistentName = "THISNameSUCK$HopefullyItIs Not~ Taken2!!";
  before(function(done) {
    var item = null ;
    do {
      item = groupsdb.findOne({name: nonexistentName}).name;
      if(item) {nonexistentName = nonexistentName + "1";}
    } while(item);
    done();
  });

  // Test that we are getting each group
  groupsdb.find().forEach(function(item) {
    var pathname = base_pathname.concat(item.name);
    describe("Individual tests for each group API: " + pathname, function() {
      it("should return data for each group",function(done){
        // calling home page api
        request(base_url)
        .get(pathname)
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err, result) {
          if(err) { throw err; }
          should.equal(result.body.name, item.name);
          done();
        });
      });
    });
  });

  it("Test the that we can get all groups",function(done){
    groupsdb.find().toArray(function(err, items) {
      if(err) { throw err; }
      request(base_url)
      .get(base_pathname)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
      .end(function(err, result) {
        if(err) { throw err; }
        items.forEach(function(item) {
          var match = false;
          result.body.forEach(function(element) {
            if(element.name == item.name) {
              match = true;
            }
          });
          should.equal(match, true );
        });
        done();
      });
    });
  });

  // TODO: Add testing for creating and deleting a group
  //  it("Test adding a group", function(done) {
  //    request(base_url)
  //  });
  //
  //  it("Test deleting a group", function(done) {
  //    request(base_url)
  //  });
});

