"use strict";
require("./node_modules/linq-to-type/src/linq-to-type.js");
var messageTypes = require("../Data/MessageTypes");
var enums = require("../Data/Enums");
var colors = require("chalk");
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
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Connect, function (server) {
            console.log("Connected!");
            _this.socket.emit(messageTypes.MessageTypes.ConnectionAck, "_consoleClient_");
        });
    };
    Client.prototype.setOnUpdate = function () {
        var _this = this;
        this.socket.on(messageTypes.MessageTypes.Update, function (update) {
            _this.redraw(update);
            _this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
        });
    };
    Client.prototype.clearConsole = function () {
        console.log('\x1Bc');
    };
    Client.prototype.drawUpdate = function (update) {
        var _loop_1 = function (row) {
            rowString = "";
            var _loop_2 = function (col) {
                if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                    rowString += colors.blue("o");
                    return "continue";
                }
                id = this_1.socket.id;
                isCookie = update.Cookies.any(function (p) { return p.X == col && p.Y == row; });
                isMine = update.Snakes
                    .where(function (s) { return s.Id == id; })
                    .selectMany(function (s) { return s.Points; })
                    .any(function (p) { return p.X == col && p.Y == row; });
                isOther = update.Snakes
                    .where(function (s) { return s.Id != id; })
                    .selectMany(function (s) { return s.Points; })
                    .any(function (p) { return p.X == col && p.Y == row; });
                if (isCookie)
                    rowString += colors.green("x");
                else if (isMine)
                    rowString += colors.red("#");
                else if (isOther)
                    rowString += colors.yellow("#");
                else
                    rowString += " ";
            };
            for (var col = 0; col < update.Width; col++) {
                _loop_2(col);
            }
            console.log(rowString);
        };
        var this_1 = this, rowString, id, isCookie, isMine, isOther;
        for (var row = 0; row < update.Height; row++) {
            _loop_1(row);
        }
    };
    Client.prototype.redraw = function (update) {
        this.clearConsole();
        this.drawUpdate(update);
    };
    return Client;
}());
var client = new Client();
client.Connect();
var loopMoveEnabled = false;
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function (key) {
    if (key == "x")
        loopMoveEnabled = !loopMoveEnabled;
    client.KeyPress(key);
});
setTimeout(function () {
    var x = 1;
    setInterval(function () {
        if (!loopMoveEnabled)
            return;
        if (x == 1)
            client.KeyPress("s");
        else if (x == 2)
            client.KeyPress("a");
        else if (x == 3)
            client.KeyPress("w");
        else if (x == 4)
            client.KeyPress("d");
        x++;
        if (x == 5)
            x = 1;
    }, 500);
}, 3000);
//# sourceMappingURL=client.js.map