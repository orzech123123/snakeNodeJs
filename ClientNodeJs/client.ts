/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>

var momentStatic = require("moment") as moment.MomentStatic;
var socketIoClientStatic = require("socket.io-client") as SocketIOClientStatic;

var moment = momentStatic() as moment.Moment;
var socket = socketIoClientStatic.connect("http://localhost:3000", { reconnection: true }) as SocketIOClient.Socket;

socket.on("connect", (socket : SocketIOClient.Socket) => {
    console.log("Connected!");
});

socket.on("pongx", msg => {
    console.log(msg);
});

socket.emit("pingx", "ee");
socket.emit("CH01", "me", "test msg 123");

class PingPonger {
    public PingPong() {
        setTimeout(() => {
                socket.emit("pingx", moment.format());
                this.PingPong();
            },
            3000);
    }
}

var pp = new PingPonger();
pp.PingPong();
