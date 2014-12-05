var util = require('util');
var t = require('exectimer');
var RouteInfo = require('./lib/route-info.js');
var RouteUtils = require('./lib/route-utils.js');

/**
 * RestAnalytics - This will hold analytics data for routes that use it's
 * middleware
 *
 * @param  {type} options description
 */
function RestAnalytics(options) {
    var self = this;

    this._data = [];
}

// RestAnalytics will emit events on new calls.
var EventEmitter = require('events').EventEmitter;
util.inherits(RestAnalytics, EventEmitter);

/**
 * RestAnalytics.prototype.middleware - description
 *
 * @param  {type} req  request
 * @param  {type} res  response
 * @param  {type} next method that calls next middleware
 * @return {type}      middleware function
 */
RestAnalytics.prototype.middleware = function() {
    var self = this;

    return function(req, res, next) {
        var tick = new t.Tick(req.url);
        tick.start();
        var timestamp = new Date().getTime();

        var requestData = RouteUtils.requestJson(req);

        var routeInfo = new RouteInfo(req);
        var info = self.routeData(routeInfo);
        info.count++;

        res.on('finish', function() {
            tick.stop();
            var responseData = RouteUtils.responseJson(res);
            var diff = tick.getDiff();

            // get duration in ms
            var duration = (diff === 0) ? 0 : diff/1000000;

            self.emit('call', {
                request: requestData,
                response: responseData,
                timestamp: timestamp,
                duration: duration
            });
        });

        next();
    };
};

/**
 * RestAnalytics.prototype.routeInfo - Gets all info gathered about the route
 * accessed by the provided request.
 *
 * @param  {type} req a request object.
 * @return {type}     json object with info related to the route accessed by this request.
 */
RestAnalytics.prototype.routeData = function(info) {
    var method = info.method.toLowerCase();
    var data = this._data[info.url];
    if(data === undefined) data = this._data[info.url] = {
    };

    if(data[method] === undefined) data[method] = {
        count: 0
    };

    return data[method];
};

function timerData(id) {
    return {
        min: t.timers[id].min(),
        max: t.timers[id].max(),
        avg: t.timers[id].mean()
    };
}

RestAnalytics.prototype.analytics = function(method, path) {
    // if path is not defined, then consider method argument as the path
    // and return analytics for all methods related to this path
    if(path === undefined) {
        path = method;
        method = undefined;
    }

    // convert method to lower case for normalized access
    if(method !== undefined) method = method.toLowerCase();

    if(path === undefined) {
        var results = {};
        for(var i in this._data) {
            results[i] = {};

            for(var j in this._data[i]) {
                results[i][j] = this.analytics(j, i);
            }
        }

        return results;
    } else {
        var result = {};

        if(method === undefined) {
            for(var m in this_data[path]) {
                result[m] = this.analytics(m, path);
            }
        } else {
            var data = this._data[path][method];

            var id = method.toLowerCase() + " " + path;
            result.count = data.count;

            if(t.timers[id] !== undefined) {
                result.time = timerData(id);
            }
        }

        return result;
    }
};

module.exports = RestAnalytics;
