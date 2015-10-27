var request = require("supertest");
var should = require("should");

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

var base_url = "http://localhost:3000";
var server = request.agent(base_url);

describe("Group Unit Tests",function(){
    var nonexistentName = "THISNameSUCK$HopefullyItIs Not~ Taken!!";
    before(function(done) {
      var item = null ;
      do {
        item = groupsdb.findOne({name: nonexistentName}).name;
        if(item) {nonexistentName = nonexistentName + "1";}
      } while(item);
      done();
    });

  groupsdb.find().forEach(function(item) {
    var pathname = "/group/".concat(item.name);
    describe("Individual tests for each group: " + pathname, function() {
      it("should return a page for each group",function(done){
        // calling home page api
        request(base_url)
        .get(pathname)
        .expect("Content-type",/html/)
        .expect(200, done) // THis is HTTP response
      });
    });
  });

  it("Test the /group url",function(done){
    var pathname = "/group";
    request(base_url)
    .get(pathname)
    .expect("Content-type",/html/)
    .expect(404,done) // THis is HTTP response
  });

   it("Test a nonexistant group name", function(done) {
     request(base_url)
     .get("/group/".concat(nonexistentName))
     .expect(404, done)
  });
});

