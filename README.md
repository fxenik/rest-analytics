rest-analytics
==============

A simple node.js module that provides analytics for REST services.

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
analytics.analytics("GET", "/users");

```
