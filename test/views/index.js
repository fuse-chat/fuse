var supertest = require("supertest");
var should = require("should");
const app_root_path = require('app-root-path').path;

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("Views tests",function(){
  // #1 should return home page

  it("should return home page",function(done){

    // calling home page api
    server
    .get("/")
    .expect(302, done) // THis is HTTP response
  });
});
