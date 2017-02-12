/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>

import * as http from "http";
import * as express from "express";
import * as socketio from "socket.io";
import * as shapes from "./X";

var application = express() as express.Express;
var server = http.createServer(application) as http.Server;
var socket = socketio(server) as SocketIO.Server;

var clients: Array<SocketIO.Socket> = [];

socket.on("connection", (socket: SocketIO.Socket) => {
    clients.push(socket);

    console.log("connection");
    socket.on("pingx", (msg : any) => {
        console.log(msg);
        socket.emit("pongx", msg);
    });

    socket.on("CH01", (from: any, msg: any) => {
        var a = new MyClass(333);
        console.log("ORZECH321!!!", from, " saying ", msg);
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

setInterval(() => {
    var randomClient: number;
    if (clients.length > 0) {
        randomClient = Math.floor(Math.random() * clients.length);
        clients[randomClient].emit("random", randomClient);

        var a = new shapes.Square();
        var a2 = new shapes.Triangle();
        var b = a.Method2();
        var b2 = a2.Method1();
        console.log(b);
        console.log(b2);
    }
}, 500);