"use strict";
var messages = require("../../Data/Messages");
var SnakeSegment = (function () {
    function SnakeSegment(segment) {
        if (segment != null)
            this.Move(segment);
    }
    SnakeSegment.prototype.Random = function (width, height) {
        this.x = this.randomIntInc(0, width - 1);
        this.y = this.randomIntInc(0, height - 1);
    };
    SnakeSegment.prototype.Move = function (segment) {
        this.x = segment.GetX();
        this.y = segment.GetY();
    };
    SnakeSegment.prototype.GetX = function () { return this.x; };
    SnakeSegment.prototype.GetY = function () { throw this.y; };
    SnakeSegment.prototype.randomIntInc = function (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    };
    SnakeSegment.prototype.GetCoordination = function () { return new messages.Point(this.x, this.y); };
    return SnakeSegment;
}());
exports.SnakeSegment = SnakeSegment;
//# sourceMappingURL=SnakeSegment.js.map