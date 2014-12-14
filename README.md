rest-analytics
==============

A simple node.js module that provides analytics for REST services.

This is still a work in progress and lots of info are still missing from the analytics.

## Usage

Add it to your connect/express application by using it's middleware.

`npm install rest-analytics`

```javascript
// Initialize analytics;
var RestAnalytics = require('rest-analytics');
var analytics = new RestAnalytics();
```

```javascript
// Use it in your express app
var express = require('express');
var app = express();
app.use(analytics.middleware());

```

```javascript
// Get a collection of analytics
analytics.analytics();

// Get a collection of analytics for a specific method/url
analytics.analytics('get', '/users');

```

## Analytics
Currently, analytics per method/path pair contain the following information:

* **count**: Number of calls for a specific method/pair
* **time.min**: Minimum ellapsed time processing a request (in nanoseconds).
* **time.max**: Minimum ellapsed time processing a request (in nanoseconds).
* **time.avg**: Average ellapsed time processing a request (in nanoseconds).

You can get analytics on method/path pairs by calling the analytics method:

```javascript
// read analytics for a specific method/path
var data = analytics.analytics('get', '/user');
console.log(data);

// {
//   'count': ...
//   'time': {
//     'min': ...
//     'max': ...
//     'avg': ...
//   }
// }
```

```javascript
// read analytics for all calls to a path
var data = analytics.analytics('/user');
console.log(data);

// {
//   'get': ...
//   'post': ...
// }
```

```javascript
// read all analytics
var data = analytics.analytics();
console.log(data);

// {
//   '/user': {
//     'get': ...
//     'post': ...
//   },
//   '/company': {
//     'get': ...
//   }
// }
```

## Events

### call

Α `'call'` event will be emitted when a request is completed (after the response is sent). It can be used to integrate collected data with other analytics systems like [Elasticsearch](http://www.elasticsearch.org) or [StatsD](https://github.com/etsy/statsd/).

 The payload of the event will contain information about this specific request:

```javascript
var express = require('express');
var RestAnalytics = require('rest-analytics');

var app = express();
var analytics = new RestAnalytics();
data.analytics.on('call', function(payload) {
    console.log(payload);
});

app.use(analytics.middleware());

```

A payload example json is:

| Tables        | Are           | Cool |
|---------------|---------------|----------|
|request|a|b|
|response|a|b|


```javascript
{
    "request": {
        "path": "/user",
        "ip": "127.0.0.1",
        "method": "GET",
        "headers": [
            {
                "key": "header",
                "value": "header value"
            }
        ],
        "query": {},
        "parameters": []
    },
    "response": {
        "status": 200,
        "headers": [
            {
                "key": "header",
                "value": "header value"
            }
        ]
    },
    "timestamp": 1418557961891,     // timestamp of call (in ms)
    "duration": 0.40668             // duration of the call (in ms)
}

```
