"use strict";
require("../node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../../Data/MessageTypes");
var messages = require("../../Data/Messages");
var enums = require("../../Data/Enums");
var h = require("./Helpers");
var ss = require("./SnakeSegment");
var Snake = (function () {
    function Snake(socket, width, height) {
        var _this = this;
        this.width = width;
        this.height = height;
        this.score = 0;
        this.segmentsToAdd = [];
        this.setOnConnectionAck = function () {
            _this.socket.on(messageTypes.MessageTypes.ConnectionAck, function (name) {
                _this.name = name;
            });
        };
        this.socket = socket;
        this.setOnConnectionAck();
        this.setOnUpdateAck();
        this.setOnChangeDirection();
        this.Recreate();
    }
    Snake.prototype.AddSegment = function () {
        this.segmentsToAdd.push(this.Head.GetCoordinations()[0]);
    };
    Snake.prototype.Recreate = function () {
        var segment = new ss.SnakeSegment();
        segment.Random(this.width, this.height);
        this.Head = segment;
        this.direction = h.MathHelper.RandomIntInc(1, 4);
        this.segmentsToAdd = [];
    };
    Snake.prototype.SendUpdate = function (update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    };
    Snake.prototype.AddScore = function () {
        this.score++;
    };
    Snake.prototype.GetName = function () {
        return this.name;
    };
    Snake.prototype.GetScore = function () {
        return this.score;
    };
    Snake.prototype.GetId = function () {
        return this.socket.id;
    };
    Snake.prototype.Update = function () {
        this.move();
        this.tryAddSegment();
    };
    Snake.prototype.tryAddSegment = function () {
        for (var _i = 0, _a = this.segmentsToAdd; _i < _a.length; _i++) {
            var segment = _a[_i];
            if (!h.CollisionHelper.CollisionPoints(this.GetCoordinations(), [segment]).any()) {
                var snakeSegment = this.Head;
                while (snakeSegment.Next != null)
                    snakeSegment = snakeSegment.Next;
                var newSegment = new ss.SnakeSegment(new messages.Point(segment.X, segment.Y));
                snakeSegment.Next = newSegment;
                this.segmentsToAdd.splice(this.segmentsToAdd.indexOf(segment), 1);
            }
        }
    };
    Snake.prototype.GetSocket = function () {
        return this.socket;
    };
    Snake.prototype.move = function () {
        this.Head.MoveDirection(this.direction);
    };
    Snake.prototype.IsEnabled = function () {
        return !!this.name;
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