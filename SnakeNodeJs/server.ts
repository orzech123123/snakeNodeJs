/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>

var express = require("express")() as Express.Application;
var httpServer = require("http").Server(express);

var socketIo = require("socket.io") as SocketIOStatic;
var socket = socketIo(httpServer) as SocketIO.Server;

socket.on("connection", (socket: SocketIO.Socket) => {
    console.log("connection");

    socket.on("pingx", (msg) => {
        console.log(msg);
        socket.emit("pongx", msg);
    });

    socket.on("CH01", (from, msg) => {
        var a = new MyClass(333);
        console.log("MSG", from, " saying ", a.a);
    });
});

httpServer.listen(3000, () => {
    console.log("listening on *:3000");
});
class MyClass {
    public a: number;

    constructor(a: number) {
        this.a = a;
    }
}