/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
"use strict";
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var application = express();
var server = http.createServer(application);
var socket = socketio(server);
var clients = [];
socket.on("connection", function (socket) {
    clients.push(socket);
    console.log("connection");
    socket.on("pingx", function (msg) {
        console.log(msg);
        socket.emit("pongx", msg);
    });
    socket.on("CH01", function (from, msg) {
        var a = new MyClass(333);
        console.log("ORZECH321!!!", from, " saying ", msg);
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
setInterval(function () {
    var randomClient;
    if (clients.length > 0) {
        randomClient = Math.floor(Math.random() * clients.length);
        clients[randomClient].emit("random", randomClient);
    }
}, 500);
//# sourceMappingURL=server.js.map