/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>
var momentStatic = require("moment");
var socketIoClientStatic = require("socket.io-client");
var moment = momentStatic();
var socket = socketIoClientStatic.connect("http://localhost:3000", { reconnection: true });
socket.on("connect", function (socket) {
    console.log("Connected!");
});
socket.on("pongx", function (msg) {
    console.log(msg);
});
socket.emit("pingx", "ee");
socket.emit("CH01", "me", "test msg 123");
var PingPonger = (function () {
    function PingPonger() {
    }
    PingPonger.prototype.PingPong = function () {
        var _this = this;
        setTimeout(function () {
            socket.emit("pingx", moment.format());
            _this.PingPong();
        }, 3000);
    };
    return PingPonger;
}());
var pp = new PingPonger();
pp.PingPong();
//# sourceMappingURL=client.js.map