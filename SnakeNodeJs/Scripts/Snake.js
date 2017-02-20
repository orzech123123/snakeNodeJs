"use strict";
require("../node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../../Data/MessageTypes");
var enums = require("../../Data/Enums");
var snakeSegment = require("./SnakeSegment");
var Snake = (function () {
    function Snake(socket, width, height) {
        this.segments = [];
        this.socket = socket;
        this.setOnUpdateAck();
        this.setOnChangeDirection();
        var segment = new snakeSegment.SnakeSegment();
        segment.Random(width, height);
        this.segments.push(segment);
        this.direction = enums.MoveDirection.Right;
    }
    Snake.prototype.SendUpdate = function (update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    };
    Snake.prototype.Update = function () {
        this.move();
    };
    Snake.prototype.GetSocket = function () {
        return this.socket;
    };
    Snake.prototype.move = function () {
        for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
            var segment = _a[_i];
            segment.MoveDirection(this.direction);
        }
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
            _this.direction = direction;
            console.log(_this.socket.id + "DIR:: " + direction);
        });
    };
    Snake.prototype.GetCoordinations = function () {
        return this.segments.selectMany(function (s) { return s.GetCoordinations(); });
    };
    return Snake;
}());
exports.Snake = Snake;
//# sourceMappingURL=Snake.js.map