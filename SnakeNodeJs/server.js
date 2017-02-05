/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
var express = require("express")();
var httpServer = require("http").Server(express);
var socketIo = require("socket.io");
var socket = socketIo(httpServer);
socket.on("connection", function (socket) {
    console.log("connection");
    socket.on("pingx", function (msg) {
        console.log(msg);
        socket.emit("pongx", msg);
    });
    socket.on("CH01", function (from, msg) {
        var a = new MyClass(333);
        console.log("MSG", from, " saying ", a.a);
    });
});
httpServer.listen(3000, function () {
    console.log("listening on *:3000");
});
var MyClass = (function () {
    function MyClass(a) {
        this.a = a;
    }
    return MyClass;
}());
//# sourceMappingURL=server.js.map