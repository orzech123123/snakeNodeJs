"use strict";
var Update = (function () {
    function Update() {
        this.Snakes = [];
        this.Cookies = [];
    }
    return Update;
}());
exports.Update = Update;
var SnakeDto = (function () {
    function SnakeDto(points, id) {
        this.Points = points;
        this.Id = id;
    }
    return SnakeDto;
}());
exports.SnakeDto = SnakeDto;
var Point = (function () {
    function Point(x, y) {
        this.X = x;
        this.Y = y;
    }
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=Messages.js.map