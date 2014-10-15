var request = require('supertest');
var expect = require('expect.js');
var should = require('should');

describe('Routing', function() {
  describe('Get / is successful', function() {
    it ('is successful', function(done){
      request('http://localhost:3030')
        .get('/')
        .expect(200)
        .end(function (err, res) {
          err.should.be.undefined;
          done();
        });
    });
  });
//
//  describe('Campaigns', function() {
//    describe('Get /api/campaigns', function() {
//      it ('is successful', function(done) {
//        request('http://localhost:3030')
//          .get('/api/campaigns')
//          .expect(200)
//          .end(function(err, res) {
//            err.should.be.undefined;
//            console.log(res);
//            done();
//          });
//      })
//    });
//  });
});