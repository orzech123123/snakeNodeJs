/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
/// <reference path="../Data/Messages.ts"/>
/// <reference path="../Data/MessageTypes.ts"/>

import * as http from "http";
import * as express from "express";
import * as socketio from "socket.io";
import * as messages from "../Data/Messages";
import * as messageTypes from "../Data/MessageTypes";

class Server {
    public clients: Array<SocketIO.Socket> = [];
    private application: express.Express;
    private server: http.Server;
    private socket : SocketIO.Server;

    constructor() {
    }

    public Start(): void {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);

        this.setOnConnection();

        this.listen();
    }

    private setOnConnection() {
        this.socket.on(messageTypes.MessageTypes.Connection, (client: SocketIO.Socket) => {
            console.log("connection");
            this.clients.push(client);

            this.setOnBoardAcknowledge(client);

            client.emit(messageTypes.MessageTypes.BoardSc, this.getBoard());
        });
    }

    private getBoard(): messages.Board {
        var board = new messages.Board();
        board.Width = 50;
        board.Height = 20;

        return board;
    }

    private setOnBoardAcknowledge(client: SocketIO.Socket): void {
        client.on(messageTypes.MessageTypes.BoardAcknowledgeCs, () => {
            console.log("client ack board");
        });
    }

    private listen(): void {
        this.server.listen(3000, () => {
            console.log("listening on *:3000");
        });
    }
}

var server = new Server();
server.Start();