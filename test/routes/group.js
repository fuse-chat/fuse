var request = require("supertest");
var should = require("should");

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

var base_url = "http://localhost:3000";
// This agent refers to PORT where program is runninng.
var server = request.agent(base_url);


// UNIT test begin

describe("Group Unit Tests",function(){

  it("should return a page for each group",function(done){
    var pathname = "/group/";
    groupsdb.find().forEach( function(item) {
      pathname = pathname.concat(item.name);
      // calling home page api
      request(base_url)
      .get(pathname)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
    });
    done();
  });

  it("should return all groups",function(done){
    var pathname = "/group";
    groupsdb.find().forEach( function(item) {
      pathname = pathname.concat(item.name);
      // calling home page api
      request(base_url)
      .get(pathname)
      .expect("Content-type",/json/)
      .expect(200) // THis is HTTP response
    });
    done();
  });

});
