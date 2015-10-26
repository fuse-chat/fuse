var request = require("supertest");
var should = require("should");

const mongo = require('mongoskin');
const db = mongo.db('mongodb://localhost:27017/fuse');
const groupsdb = db.collection('groups');

var base_url = "http://localhost:3000";
// This agent refers to PORT where program is runninng.
var server = request.agent(base_url);

    //groupsdb.find().forEach( function(item) {
    //  pathname = pathname.concat(item.name);

// UNIT test begin

describe("Group Unit Tests",function(){

  // TODO: I cannot figure out how loops work with supertest,
  // so figure that out
//  it("should return a page for each group",function(done){
//    var pathname = "/group/Persist";
//      // calling home page api
//      var r = request(base_url)
//      .get(pathname)
//      .set('Connection', 'keep-alive')
//      .expect("Content-type",/html/)
//      .expect(200) // THis is HTTP response
//      .end(function(err, res) {
//        if(err) {
//          throw err;
//        }
//        done();
//      });
//  });

  it("should not exist",function(done){
    var pathname = "/group";
    request(base_url)
    .get(pathname)
    .expect("Content-type",/html/)
    .expect(404,done) // THis is HTTP response
  });

});
