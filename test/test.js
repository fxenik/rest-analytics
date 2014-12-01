var supertest = require('supertest');
var mocha = require('mocha');
var express = require('express');
var assert = require('assert');
var RestAnalytics = require('../index.js');

// analytics middleware should be registered before anything else

function appWithAnalytics() {
    var app = express();
    var analytics = new RestAnalytics();
    app.use(analytics.middleware());

    app.get('/user', function(req, res){
        res.send(200, { name: 'tobi' });
    });

    return {
        app: app,
        analytics: analytics
    };
}


describe('GET /user', function() {
    it('should increase route count to 1', function(done) {
        var data = appWithAnalytics();
        supertest(data.app)
        .get('/user')
        .end(function(err, res) {
            assert.equal(data.analytics.analytics('GET /user').count, 1);
            done();
        });


    });
});

describe('GET /user', function() {
    it('should increase route count to 2', function(done) {
        var data = appWithAnalytics();
        supertest(data.app)
        .get('/user')
        .end(function(err, res) {
            supertest(data.app)
            .get('/user')
            .end(function(err, res) {
                assert.equal(data.analytics.analytics('GET /user').count, 2);
                done();
            });
        });


    });
});

describe('GET /user', function() {
    it('should be able to get data providing method and path in different parameteres', function(done) {
        var data = appWithAnalytics();
        supertest(data.app)
        .get('/user')
        .end(function(err, res) {
            supertest(data.app)
            .get('/user')
            .end(function(err, res) {
                assert.equal(data.analytics.analytics('GET',  '/user').count, 2);
                done();
            });
        });


    });
});
