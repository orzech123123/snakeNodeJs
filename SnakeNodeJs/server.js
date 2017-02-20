"use strict";
require("./node_modules/linq-to-type/src/linq-to-type.js");
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var messages = require("../Data/Messages");
var messageTypes = require("../Data/MessageTypes");
var snake = require("./Scripts/Snake");
var Snake = snake.Snake;
var Server = (function () {
    function Server() {
        this.snakes = [];
        this.width = 50;
        this.height = 20;
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
        for (var _i = 0, _a = this.snakes; _i < _a.length; _i++) {
            var snake_1 = _a[_i];
            snake_1.Update();
        }
        var update = new messages.Update();
        update.Points = this.snakes.selectMany(function (s) { return s.GetCoordinations(); });
        update.Width = this.width;
        update.Height = this.height;
        for (var _b = 0, _c = this.snakes; _b < _c.length; _b++) {
            var snake_2 = _c[_b];
            snake_2.SendUpdate(update);
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