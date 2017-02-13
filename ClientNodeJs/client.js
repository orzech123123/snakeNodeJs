"use strict";
var messageTypes = require("../Data/MessageTypes");
var socketio = require("socket.io-client");
var boardx = require("./BoardHelper");
var BoardHelper = boardx.BoardHelper;
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
            console.log("Asd");
            console.log("Asd");
            console.log("Asd");
            console.log("Asd");
            console.log("Asd");
            console.log("Asd");
            console.log('\x1Bc');
            BoardHelper.DrawBoard(board);
            _this.socket.emit(messageTypes.MessageTypes.BoardAcknowledgeCs, 1);
        });
    };
    return Client;
}());
var client = new Client();
client.Connect();
//# sourceMappingURL=client.js.map