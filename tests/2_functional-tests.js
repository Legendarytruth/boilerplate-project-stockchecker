const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Viewing one stock',  function(done){
        chai.request(server)
        .get('/api/stock-prices/')
        .query({stock: 'GOOG'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.property(res.body.stockData, 'price')
          assert.property(res.body.stockData, 'likes')
          done();
        })
    });

    test('Viewing one stock and liking it',  function(done){
        chai.request(server)
        .get('/api/stock-prices/')
        .query({stock: 'GOOG', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.property(res.body.stockData, 'price')
          assert.isAbove(res.body.stockData.likes, 0)
          done();
        })
    });

    test('Viewing the same stock and liking it again',  function(done){
        chai.request(server)
        .get('/api/stock-prices/')
        .query({stock: 'GOOG', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.stockData.stock, 'GOOG')
          assert.property(res.body.stockData, 'price')
          assert.isAbove(res.body.stockData.likes, 0)
          done();
        })
    });

    test('Viewing two stocks',  function(done){
        chai.request(server)
        .get('/api/stock-prices/')
        .query({stock: ['GOOG', 'MSFT']})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.stockData[0].stock, 'GOOG')
          assert.equal(res.body.stockData[1].stock, 'MSFT')
          assert.property(res.body.stockData[0], 'price')
          assert.property(res.body.stockData[1], 'price')
          assert.property(res.body.stockData[0], 'rel_likes')
          assert.property(res.body.stockData[1], 'rel_likes')
          done();
        })
    });

    test('Viewing two stocks and liking them:',  function(done){
        chai.request(server)
        .get('/api/stock-prices/')
        .query({stock: ['GOOG', 'MSFT'], like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.deepEqual(res.body.stockData[0].stock, 'GOOG')
          assert.deepEqual(res.body.stockData[1].stock, 'MSFT')
          assert.property(res.body.stockData[0], 'price')
          assert.property(res.body.stockData[1], 'price')
          assert.property(res.body.stockData[0], 'rel_likes')
          assert.property(res.body.stockData[1], 'rel_likes')
          done();
        })
    });         

});
