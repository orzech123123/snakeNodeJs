"use strict";
require("../node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../../Data/MessageTypes");
var enums = require("../../Data/Enums");
var snakeSegment = require("./SnakeSegment");
var Snake = (function () {
    function Snake(socket, width, height) {
        this.socket = socket;
        this.setOnUpdateAck();
        this.setOnChangeDirection();
        var segment = new snakeSegment.SnakeSegment();
        segment.Random(width, height);
        var next = new snakeSegment.SnakeSegment(segment.GetCoordinations()[0]);
        segment.Next = next;
        var next2 = new snakeSegment.SnakeSegment(next.GetCoordinations()[0]);
        next.Next = next2;
        var next3 = new snakeSegment.SnakeSegment(next2.GetCoordinations()[0]);
        next2.Next = next3;
        var next4 = new snakeSegment.SnakeSegment(next3.GetCoordinations()[0]);
        next3.Next = next4;
        this.head = segment;
        this.direction = enums.MoveDirection.Right;
    }
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
        this.head.MoveDirection(this.direction);
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
        var segment = this.head;
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