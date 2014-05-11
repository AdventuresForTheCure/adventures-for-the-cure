var request = require('superagent');
var expect = require('expect.js');
var assert = require('assert');

describe('Suite one', function(){
  it (function(done){
    request('http://localhost:3030')
      .get('/')
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        parseFloat(res.text).should.equal(2);
        done();
      });
  });
});