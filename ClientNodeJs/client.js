"use strict";
var messageTypes = require("../Data/MessageTypes");
var enums = require("../Data/Enums");
var socketio = require("socket.io-client");
var TS_1 = require("./node_modules/typescript-linq/TS");
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
            console.log('\x1Bc');
            var points = new TS_1.TS.Collections.List(true);
            points.add(update.Points);
            for (var row = 0; row < update.Height; row++) {
                var rowString = "";
                for (var col = 0; col < update.Width; col++) {
                    var found = false;
                    for (var _i = 0, _a = update.Points; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (p.X === row && p.Y === col) {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        rowString += "#";
                    else
                        rowString += ".";
                }
                console.log(rowString);
            }
            _this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
        });
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