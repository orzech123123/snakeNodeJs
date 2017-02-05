/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
"use strict";
var express = require("express");
var socketIo = require("socket.io");
var http = require("http");
var application = express();
var server = http.Server(application);
var socket = socketIo(server);
socket.on("connection", function (socket) {
    console.log("connection");
    socket.on("pingx", function (msg) {
        console.log(msg);
        socket.emit("pongx", msg);
    });
    socket.on("CH01", function (from, msg) {
        var a = new MyClass(333);
        console.log("This is message", from, " saying ", msg);
    });
});
server.listen(3000, function () {
    console.log("listening on *:3000");
});
var MyClass = (function () {
    function MyClass(a) {
        this.a = a;
    }
    return MyClass;
}());
//# sourceMappingURL=server.js.map