/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>

import Http = require("http");

var express = require("express");
var socketIo = require("socket.io") as SocketIOStatic;
var http = require("http");

var application = express() as Express.Application;
var server = http.Server(application) as Http.Server;
var socket = socketIo(server) as SocketIO.Server;

socket.on("connection", (socket: SocketIO.Socket) => {
    console.log("connection");

    socket.on("pingx", (msg) => {
        console.log(msg);
        socket.emit("pongx", msg);
    });

    socket.on("CH01", (from, msg) => {
        var a = new MyClass(333);
        console.log("This is message", from, " saying ", msg);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
class MyClass {
    public a: number;

    constructor(a: number) {
        this.a = a;
    }
}