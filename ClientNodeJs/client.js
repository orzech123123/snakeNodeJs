"use strict";
require("./node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../Data/MessageTypes");
var enums = require("../Data/Enums");
var socketio = require("socket.io-client");
var Client = (function () {
    function Client() {
    }
    Client.prototype.Connect = function () {
        this.socket = socketio.connect("http://localhost:3000", { reconnection: true });
        this.setOnConnect();
        this.setOnUpdate();
    };
    Client.prototype.KeyPress = function (key) {
        if (key == "w")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Up);
        if (key == "s")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Down);
        if (key == "a")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Left);
        if (key == "d")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Right);
    };
    Client.prototype.setOnConnect = function () {
        this.socket.on(messageTypes.MessageTypes.Connect, function (server) {
            console.log("Connected!");
        });
    };
    Client.prototype.setOnUpdate = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Update, function (update) {
            _this.redraw(update);
            _this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
        });
    };
    Client.prototype.redraw = function (update) {
        console.log('\x1Bc');
        var _loop_1 = function (row) {
            rowString = "";
            var _loop_2 = function (col) {
                if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                    rowString += "o";
                    return "continue";
                }
                if (update.Points.any(function (p) { return p.X == col && p.Y == row; }))
                    rowString += "#";
                else
                    rowString += " ";
            };
            for (var col = 0; col < update.Width; col++) {
                _loop_2(col);
            }
            console.log(rowString);
        };
        var rowString;
        for (var row = 0; row < update.Height; row++) {
            _loop_1(row);
        }
        this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
    };
    return Client;
}());
var client = new Client();
client.Connect();
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function (key) {
    client.KeyPress(key);
});
//# sourceMappingURL=client.js.map