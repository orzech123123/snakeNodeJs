"use strict";
var messages = require("../../Data/Messages");
var enums = require("../../Data/Enums");
var SnakeSegment = (function () {
    function SnakeSegment(point) {
        if (point != null) {
            this.x = point.X;
            this.y = point.Y;
        }
    }
    SnakeSegment.prototype.Random = function (width, height) {
        this.x = this.randomIntInc(0, width - 1);
        this.y = this.randomIntInc(0, height - 1);
    };
    SnakeSegment.prototype.MoveSegment = function (segment) {
        if (this.Next != null)
            this.Next.MoveSegment(this);
        this.x = segment.GetCoordinations()[0].X;
        this.y = segment.GetCoordinations()[0].Y;
    };
    SnakeSegment.prototype.MoveDirection = function (direction) {
        if (this.Next != null)
            this.Next.MoveSegment(this);
        if (direction === enums.MoveDirection.Up)
            this.y--;
        if (direction === enums.MoveDirection.Down)
            this.y++;
        if (direction === enums.MoveDirection.Left)
            this.x--;
        if (direction === enums.MoveDirection.Right)
            this.x++;
    };
    SnakeSegment.prototype.randomIntInc = function (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    };
    SnakeSegment.prototype.GetCoordinations = function () { return [new messages.Point(this.x, this.y)]; };
    return SnakeSegment;
}());
exports.SnakeSegment = SnakeSegment;
//# sourceMappingURL=SnakeSegment.js.map