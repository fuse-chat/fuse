const request = require("supertest");
const expect = require("chai").expect;
const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

const base_url = "http://localhost:3000";
const base_pathname = "/api/1/groups/";
const server = request.agent(base_url);

const LIMIT_IN_MILLISECONDS_EXIST = 20;
const LIMIT_IN_MILLISECONDS_NOTEXIST = 200;

describe("Group API timing tests",function() {
  groupsdb.find().forEach(function(item) {
    var pathname = base_pathname.concat(item.name);
    
    describe("Getting each exisiting group" + pathname, function() {
      it("should meet time constraints for exisiting geoups  " + LIMIT_IN_MILLISECONDS_EXIST + " ms", function(done){
        var start = Date.now();

        request(base_url)
        .get(pathname)
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err, result) {
          if(err) { throw err; }
          var elapsed = Date.now() - start;
          expect(elapsed).to.be.below(LIMIT_IN_MILLISECONDS_EXIST);
          done();
        });

      });
    });

  });

  var groupCreated = false;
  var nonexistentName = "THISNameSUCK$HopefullyItIs Not~ Taken2!!";

  it("should meet time constraints for non-exisiting groups " + LIMIT_IN_MILLISECONDS_NOTEXIST + " ms", function(done){
    var start = Date.now();

    request(base_url)
    .get(base_pathname.concat(nonexistentName))
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err, result) {
      if(err) { throw err; }
      var elapsed = Date.now() - start;
      expect(elapsed).to.be.below(LIMIT_IN_MILLISECONDS_NOTEXIST);
      done();
    });
  });


  it("should get all groups within time constraints " + LIMIT_IN_MILLISECONDS_EXIST + " ms", function(done) {
    var start = Date.now();
    
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
        });

        var elapsed = Date.now() - start;
        expect(elapsed).to.be.below(LIMIT_IN_MILLISECONDS_NOTEXIST);
        done();
      });
    });
  });
});

