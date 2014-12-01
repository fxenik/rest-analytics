function RouteInfo(req) {
    this.url = req.url;
    this.method = req.method;
}

RouteInfo.prototype.id = function() {
    return this.method.toLowerCase() + " " + this.url;
};

module.exports = RouteInfo;
