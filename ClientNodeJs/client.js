"use strict";
var messageTypes = require("../Data/MessageTypes");
var socketio = require("socket.io-client");
var Client = (function () {
    function Client() {
    }
    Client.prototype.Connect = function () {
        this.socket = socketio.connect("http://localhost:3000", { reconnection: true });
        this.setOnConnect();
        this.setOnBoardSc();
    };
    Client.prototype.setOnConnect = function () {
        this.socket.on(messageTypes.MessageTypes.Connect, function (server) {
            console.log("Connected!");
        });
    };
    Client.prototype.setOnBoardSc = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.BoardSc, function (board) {
            console.log(board.Width);
            console.log(board.Height);
            _this.socket.emit(messageTypes.MessageTypes.BoardAcknowledgeCs, 1);
        });
    };
    return Client;
}());
var client = new Client();
client.Connect();
//# sourceMappingURL=client.js.map