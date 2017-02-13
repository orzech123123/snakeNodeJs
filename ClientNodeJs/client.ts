/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>
/// <reference path="../Data/Messages.ts"/>
/// <reference path="../Data/MessageTypes.ts"/>

import * as messages from "../Data/Messages";
import * as messageTypes from "../Data/MessageTypes";
import * as moment from "moment";
import * as socketio from "socket.io-client";

class Client {
    private socket: SocketIOClient.Socket;

    constructor() {
        
    }

    public Connect(): void {
        this.socket = socketio.connect("http://localhost:3000", { reconnection: true });

        this.setOnConnect();
        this.setOnBoardSc();
    }


    private setOnConnect(): void {
        this.socket.on(messageTypes.MessageTypes.Connect, (server: SocketIOClient.Socket) => {
            console.log("Connected!");
        });
    }

    private setOnBoardSc(): void {
        this.socket.on(messageTypes.MessageTypes.BoardSc, (board: messages.Board) => { 
            console.log(board.Width);
            console.log(board.Height);
            
            this.socket.emit(messageTypes.MessageTypes.BoardAcknowledgeCs, 1);
        });
    }
}

var client = new Client();
client.Connect();
