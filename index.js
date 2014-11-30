var t = require('exectimer');
var RouteInfo = require('./lib/routeInfo.js');

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

        var routeInfo = new RouteInfo(req);
        var info = self.routeData(routeInfo);
        info.count++;

        // This will run after some data is sent as a response
        var oldSend = res.send;
        res.send = function(status, body) {
            res.send = oldSend;
            res.send.apply(this, arguments);
        };

        // This will run when the responses ends. It is the proper time to see the response status
        var oldEnd = res.end;
        res.end = function(chunk, encoding) {
            res.end = oldEnd;
            tick.stop();
            res.end.apply(this, arguments);
        };

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
RestAnalytics.prototype.routeData = function(routeInfo) {
    var id = routeInfo.id();

    if(this._data[id] === undefined) this._data[id] = {
        count: 0
    };

    return this._data[id];
};

function timerData(id) {
    return {
        min: t.timers[id].min(),
        max: t.timers[id].max(),
        mean: t.timers[id].mean()
    };
}

RestAnalytics.prototype.analytics = function(id) {
    if(id === undefined) {
        var results = {};
        for(var i in this._data) {
            results[i] = this.analytics(i);

        }

        return results;
    } else {
        var result = {
            count: this._data[id].count
        };

        if(t.timers[id] !== undefined) {
            result.time = timerData(id);
        }

        return result;
    }
};

module.exports = RestAnalytics;
