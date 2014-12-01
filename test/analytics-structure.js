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

    app.get('/company', function(req, res){
        res.send(200, { name: 'company' });
    });

    app.post('/user', function(req, res){
        res.send(200, { });
    });

    return {
        app: app,
        analytics: analytics
    };
}


describe('Analytics structure', function() {
    it('should have keys per url, and each url object should have keys per method', function(done) {
        var data = appWithAnalytics();
        supertest(data.app)
        .get('/user')
        .end(function(err, res) {
            supertest(data.app)
            .post('/user')
            .end(function(err, res) {
                supertest(data.app)
                .get('/company')
                .end(function(err, res) {
                    var analytics = data.analytics.analytics();
                    assert.ok(analytics['/user'] !== undefined, "no /user key");
                    assert.ok(analytics['/user'].get !== undefined, " no /user.get key");
                    assert.ok(analytics['/user'].post !== undefined, " no /user.post key");
                    assert.ok(analytics['/company'] !== undefined, " no /company key");
                    assert.ok(analytics['/company'].get !== undefined, " no /company.get key");
                    assert.ok(analytics['/company'].post === undefined, " has /company.post key");
                    done();
                });
            });
        });


    });
});
