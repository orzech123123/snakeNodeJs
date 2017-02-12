/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>

import * as moment from "moment";
import * as socketio from "socket.io-client";

var socket = socketio.connect("http://localhost:3000", { reconnection: true });

socket.on("connect", (socket: SocketIOClient.Socket) => {
    console.log("Connected!");
});

socket.on("pongx", msg => {
    console.log(msg);
});

socket.on("random", msg => {
    console.log("-----------" + msg + "------------");
});

socket.emit("pingx", "ee");
socket.emit("CH01", "me", "ORZECH!!!");

class PingPonger {
    public PingPong() {
        setTimeout(() => {
            socket.emit("pingx", moment().format());
            this.PingPong();
        },
            3000);
    }
}

var pp = new PingPonger();
pp.PingPong();
