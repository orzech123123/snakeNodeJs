"use strict";
var http = require("http");
var TS_1 = require("./node_modules/typescript-linq/TS");
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
        var tmp = new TS_1.TS.Collections.List(true);
        for (var _b = 0, _c = this.snakes; _b < _c.length; _b++) {
            var snake_2 = _c[_b];
            tmp.add(snake_2.GetCoordinations()[0]);
        }
        update.Points = tmp.toArray();
        update.Width = this.width;
        update.Height = this.height;
        for (var _d = 0, _e = this.snakes; _d < _e.length; _d++) {
            var snake_3 = _e[_d];
            snake_3.SendUpdate(update);
        }
    };
    Server.prototype.setLoop = function () {
        var _this = this;
        setInterval(function () {
            _this.update();
        }, 1000);
    };
    return Server;
}());
var server = new Server();
server.Start();
//# sourceMappingURL=server.js.map