"use strict";
require("../node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../../Data/MessageTypes");
var messages = require("../../Data/Messages");
var enums = require("../../Data/Enums");
var mh = require("./MathHelper");
var snakeSegment = require("./SnakeSegment");
var Snake = (function () {
    function Snake(socket, width, height) {
        this.width = width;
        this.height = height;
        this.socket = socket;
        this.setOnUpdateAck();
        this.setOnChangeDirection();
        this.Recreate();
    }
    Snake.prototype.AddSegment = function (x, y) {
        var newHead = new snakeSegment.SnakeSegment(new messages.Point(x, y));
        newHead.Next = this.Head;
        this.Head = newHead;
    };
    Snake.prototype.Recreate = function () {
        var segment = new snakeSegment.SnakeSegment();
        segment.Random(this.width, this.height);
        this.Head = segment;
        this.direction = mh.MathHelper.RandomIntInc(1, 4);
    };
    Snake.prototype.SendUpdate = function (update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    };
    Snake.prototype.GetId = function () {
        return this.socket.id;
    };
    Snake.prototype.Update = function () {
        this.move();
    };
    Snake.prototype.GetSocket = function () {
        return this.socket;
    };
    Snake.prototype.move = function () {
        this.Head.MoveDirection(this.direction);
    };
    Snake.prototype.setOnUpdateAck = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.UpdateAck, function () {
            _this.lastUpdateAck = Date.now();
        });
    };
    Snake.prototype.setOnChangeDirection = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.ChangeDirection, function (direction) {
            if (direction === enums.MoveDirection.Up && (_this.direction === enums.MoveDirection.Left || _this.direction == enums.MoveDirection.Right))
                _this.setDirection(direction);
            if (direction === enums.MoveDirection.Down && (_this.direction === enums.MoveDirection.Left || _this.direction == enums.MoveDirection.Right))
                _this.setDirection(direction);
            if (direction === enums.MoveDirection.Left && (_this.direction === enums.MoveDirection.Up || _this.direction == enums.MoveDirection.Down))
                _this.setDirection(direction);
            if (direction === enums.MoveDirection.Right && (_this.direction === enums.MoveDirection.Up || _this.direction == enums.MoveDirection.Down))
                _this.setDirection(direction);
        });
    };
    Snake.prototype.setDirection = function (direction) {
        this.direction = direction;
        console.log(this.socket.id + "DIR:: " + direction);
    };
    Snake.prototype.GetCoordinations = function () {
        var result = new Array();
        var segment = this.Head;
        while (segment != null) {
            result.push(segment.GetCoordinations()[0]);
            segment = segment.Next;
        }
        return result;
    };
    return Snake;
}());
exports.Snake = Snake;
//# sourceMappingURL=Snake.js.map