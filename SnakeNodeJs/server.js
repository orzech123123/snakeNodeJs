"use strict";
require("./node_modules/linq-to-type/src/linq-to-type.js");
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var messages = require("../Data/Messages");
var messageTypes = require("../Data/MessageTypes");
var mh = require("./Scripts/MathHelper");
var snake = require("./Scripts/Snake");
var Snake = snake.Snake;
var Server = (function () {
    function Server() {
        this.snakes = [];
        this.width = 50;
        this.height = 20;
        this.xxx = mh.MathHelper.RandomIntInc(1, this.width - 2);
        this.yyy = mh.MathHelper.RandomIntInc(1, this.height - 2);
    }
    Server.prototype.Start = function () {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);
        this.setOnConnection();
        this.listen();
        this.setLoop();
    };
    Server.prototype.setOnConnection = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Connection, function (client) {
            console.log("Client connected: " + client.id);
            var snake = new Snake(client, _this.width, _this.height);
            _this.snakes.push(snake);
        });
    };
    Server.prototype.listen = function () {
        this.server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    };
    Server.prototype.update = function () {
        var _this = this;
        for (var _i = 0, _a = this.snakes; _i < _a.length; _i++) {
            var snake_1 = _a[_i];
            snake_1.Update();
        }
        for (var _b = 0, _c = this.snakes; _b < _c.length; _b++) {
            var snake_2 = _c[_b];
            var head = snake_2.Head.GetCoordinations()[0];
            if (this.xxx === head.X && this.yyy === head.Y) {
                snake_2.AddSegment(this.xxx, this.yyy);
                this.xxx = mh.MathHelper.RandomIntInc(1, this.width - 2);
                this.yyy = mh.MathHelper.RandomIntInc(1, this.height - 2);
            }
        }
        for (var _d = 0, _e = this.snakes; _d < _e.length; _d++) {
            var snake_3 = _e[_d];
            if (snake_3.GetCoordinations().any(function (p) { return p.X == 0 || p.X == _this.width - 1 || p.Y == 0 || p.Y == _this.height - 1; })) {
                snake_3.Recreate();
            }
        }
        var update = new messages.Update();
        update.Snakes = this.snakes.select(function (s) { return new messages.SnakeDto(s.GetCoordinations(), s.GetId()); });
        update.Width = this.width;
        update.Height = this.height;
        update.Cookies.push(new messages.Point(this.xxx, this.yyy));
        for (var _f = 0, _g = this.snakes; _f < _g.length; _f++) {
            var snake_4 = _g[_f];
            snake_4.SendUpdate(update);
        }
    };
    Server.prototype.setLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.update();
        }, 100);
    };
    return Server;
}());
var server = new Server();
server.Start();
//# sourceMappingURL=server.js.map