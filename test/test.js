var supertest = require("supertest");
var should = require("should");
var port = 8080;             //need to be equal to express server port
var expected_res_num = 5;    //equal to services amount

// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:"+port);

// UNIT test begin
describe("unit test",function() {

    // #1 should return all services statuse
    it("should return url & status for each service",function(done){
        this.timeout(5000); //extend timeout from default (2000)
        server
        .get("/statuses")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.matchEach(function(value) { value.should.have.property('url')});
          res.body.should.matchEach(function(value) { value.should.have.property('status')});
          done();
        });
    });

    // #2 should return the availability precenteg of all services
    it("should return url & availability for each service",function(done){
        server
        .get('/availability')
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.matchEach(function(value) { value.should.have.property('url')});
          res.body.should.matchEach(function(value) { value.should.have.property('available_percentage')});
          done();
        });
    });

    // #3 should check the number of results for status request
    it("statuses Request - should return results number equal to services number",function(done){
        this.timeout(5000); //extend timeout from default (2000)
        server
        .get("/statuses")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.length(expected_res_num);
          done();
        });
    });

    // #4 should check the number of results for availability request
    it("availability Request - should return results number equal to services number",function(done){
        server
        .get("/availability")
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.length(expected_res_num);
          done();
        });
    });

    // #5 page not fount
    it("should return 404",function(done){
    server
    .get("/random")
    .expect(404)
    .end(function(err,res){
      res.status.should.equal(404);
      done();
    });
  })
});
