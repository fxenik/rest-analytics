var util = {};

util.requestJson = function(request) {
    var headers = [];
    for(var header in request.headers) {
        headers.push({
            key: header,
            value: request.headers[header]
        });
    }

    var parameters = [];
    for(var parameter in request.params) {
        parameters.push({
            key: parameter,
            value: request.params[parameter]
        });
    }

    return {
        path: request.path,
        ip: request.ip,
        method: request.method,
        headers: headers,
        query: request.query,
        parameters: parameters
    };
};

util.responseJson = function(response) {
    var headers = [];
    for(var header in response._headers) {
        headers.push({
            key: header,
            value: response._headers[header]
        });
    }

    return {
        status: response.statusCode,
        headers: headers
    };
};

module.exports = util;
