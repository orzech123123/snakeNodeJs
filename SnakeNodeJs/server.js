"use strict";
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var messages = require("../Data/Messages");
var messageTypes = require("../Data/MessageTypes");
var Server = (function () {
    function Server() {
        this.clients = [];
    }
    Server.prototype.Start = function () {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);
        this.setOnConnection();
        this.listen();
    };
    Server.prototype.setOnConnection = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Connection, function (client) {
            console.log("connection");
            _this.clients.push(client);
            _this.setOnBoardAcknowledge(client);
            client.emit(messageTypes.MessageTypes.BoardSc, _this.getBoard());
        });
    };
    Server.prototype.getBoard = function () {
        var board = new messages.Board();
        board.Width = 50;
        board.Height = 20;
        return board;
    };
    Server.prototype.setOnBoardAcknowledge = function (client) {
        client.on(messageTypes.MessageTypes.BoardAcknowledgeCs, function () {
            console.log("client ack board");
        });
    };
    Server.prototype.listen = function () {
        this.server.listen(3000, function () {
            console.log("listening on *:3000");
        });
    };
    return Server;
}());
var server = new Server();
server.Start();
//# sourceMappingURL=server.js.map