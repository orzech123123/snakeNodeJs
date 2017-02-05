/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>

var moment = require("moment")() as moment.Moment;
var io = require("socket.io-client") as SocketIOClientStatic;
var socket = io.connect("http://localhost:3000", { reconnection: true }) as SocketIOClient.Socket;

socket.on("connect", (socket : SocketIOClient.Socket) => {
    console.log("Connected!");
});

socket.on("pongx", msg => {
    console.log(msg);
});

socket.emit("pingx", "ee");
socket.emit("CH01", "me", "test msg");

class PingPonger {
    public PingPong() {
        setTimeout(() => {
            socket.emit("pingx", moment.format());
            this.PingPong();
        }, 3000);
    }    
}

var pp = new PingPonger();
pp.PingPong();