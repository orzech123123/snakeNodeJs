"use strict";
var messages = require("../../Data/Messages");
var enums = require("../../Data/Enums");
var mh = require("./MathHelper");
var SnakeSegment = (function () {
    function SnakeSegment(point) {
        if (point != null) {
            this.x = point.X;
            this.y = point.Y;
        }
    }
    SnakeSegment.prototype.Random = function (width, height) {
        this.x = mh.MathHelper.RandomIntInc(1, width - 2);
        this.y = mh.MathHelper.RandomIntInc(1, height - 2);
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
    SnakeSegment.prototype.GetCoordinations = function () { return [new messages.Point(this.x, this.y)]; };
    return SnakeSegment;
}());
exports.SnakeSegment = SnakeSegment;
//# sourceMappingURL=SnakeSegment.js.map