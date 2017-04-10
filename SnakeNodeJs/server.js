"use strict";
require("./node_modules/linq-to-type/src/linq-to-type.js");
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var messages = require("../Data/Messages");
var messageTypes = require("../Data/MessageTypes");
var h = require("./Scripts/Helpers");
var snake = require("./Scripts/Snake");
var Snake = snake.Snake;
var Server = (function () {
    function Server() {
        this.allSnakes = [];
        this.width = 25;
        this.height = 25;
        this.cookies = [];
        this.cookiesCount = 8;
    }
    Server.prototype.snakes = function () {
        return this.allSnakes.where(function (s) { return s.IsEnabled(); });
    };
    ;
    Server.prototype.Start = function () {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);
        this.setOnConnection();
        this.listen();
        this.setLoop();
        this.RecreateCookies();
    };
    Server.prototype.RecreateCookies = function () {
        var toCreate = this.cookiesCount - this.cookies.length;
        while (toCreate > 0) {
            var point = new messages.Point(h.MathHelper.RandomIntInc(1, this.width - 2), h.MathHelper.RandomIntInc(1, this.height - 2));
            var snakeCollisions = h.CollisionHelper.CollisionPoints(this.snakes().selectMany(function (s) { return s.GetCoordinations(); }), [point]);
            var cookieCollisions = h.CollisionHelper.CollisionPoints(this.cookies, [point]);
            if (!snakeCollisions.any() && !cookieCollisions.any())
                this.cookies.push(point);
            toCreate--;
        }
    };
    Server.prototype.setOnConnection = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Connection, function (client) {
            console.log("Snake connected: " + client.id);
            var snake = new Snake(client, _this.width, _this.height);
            _this.allSnakes.push(snake);
            _this.setOnDisconnect(client);
        });
    };
    Server.prototype.setOnDisconnect = function (socket) {
        var _this = this;
        socket.on(messageTypes.MessageTypes.Disconnect, function () {
            var snake = _this.allSnakes.firstOrDefault(function (s) { return s.GetId() == socket.id; });
            var index = _this.allSnakes.indexOf(snake);
            _this.allSnakes.splice(index, 1);
        });
    };
    Server.prototype.listen = function () {
        this.server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    };
    Server.prototype.processCollisions = function () {
        var _this = this;
        for (var _i = 0, _a = this.snakes(); _i < _a.length; _i++) {
            var snake_1 = _a[_i];
            var head = snake_1.Head;
            var next = snake_1.Head.Next;
            while (!!next) {
                if (h.CollisionHelper.CollisionPoints(head.GetCoordinations(), next.GetCoordinations()).any()) {
                    snake_1.Recreate();
                    break;
                }
                next = next.Next;
            }
        }
        for (var _b = 0, _c = this.snakes(); _b < _c.length; _b++) {
            var snake_2 = _c[_b];
            for (var _d = 0, _e = this.snakes(); _d < _e.length; _d++) {
                var snake2 = _e[_d];
                if (snake_2.GetId() == snake2.GetId())
                    continue;
                if (h.CollisionHelper.CollisionPoints(snake_2.Head.GetCoordinations(), snake2.GetCoordinations()).any()) {
                    var tmpHead = snake_2.Head;
                    snake_2.Recreate();
                    if (h.CollisionHelper.CollisionPoints(tmpHead.GetCoordinations(), snake2.Head.GetCoordinations()).any()) {
                        snake2.Recreate();
                    }
                }
            }
        }
        for (var _f = 0, _g = this.snakes(); _f < _g.length; _f++) {
            var snake_3 = _g[_f];
            var collisionPoints = h.CollisionHelper.CollisionPoints(snake_3.Head.GetCoordinations(), this.cookies);
            if (collisionPoints.any()) {
                snake_3.AddScore();
                snake_3.AddSegment();
                var firstIndex = this.cookies.indexOf(collisionPoints[0]);
                var secondIndex = this.cookies.indexOf(collisionPoints[1]);
                if (firstIndex > -1)
                    this.cookies.splice(firstIndex, 1);
                if (secondIndex > -1)
                    this.cookies.splice(secondIndex, 1);
            }
        }
        this.RecreateCookies();
        for (var _h = 0, _j = this.snakes(); _h < _j.length; _h++) {
            var snake_4 = _j[_h];
            if (snake_4.GetCoordinations().any(function (p) { return p.X == 0 || p.X == _this.width - 1 || p.Y == 0 || p.Y == _this.height - 1; })) {
                snake_4.Recreate();
            }
        }
    };
    Server.prototype.update = function () {
        for (var _i = 0, _a = this.snakes(); _i < _a.length; _i++) {
            var snake_5 = _a[_i];
            snake_5.Update();
        }
        this.processCollisions();
        var update = new messages.Update();
        update.Snakes = this.snakes().select(function (s) { return new messages.SnakeDto(s.GetCoordinations(), s.GetId(), s.GetName(), s.GetScore()); });
        update.Width = this.width;
        update.Height = this.height;
        update.Cookies = this.cookies;
        for (var _b = 0, _c = this.snakes(); _b < _c.length; _b++) {
            var snake_6 = _c[_b];
            snake_6.SendUpdate(update);
        }
    };
    Server.prototype.setLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.update();
        }, 150);
    };
    return Server;
}());
var server = new Server();
server.Start();
//# sourceMappingURL=server.js.map