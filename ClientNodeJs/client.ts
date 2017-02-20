/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>
/// <reference path="../Data/Messages.ts"/>
/// <reference path="../Data/MessageTypes.ts"/>
/// <reference path="../Data/Enums.ts"/>

import * as messages from "../Data/Messages";
import * as messageTypes from "../Data/MessageTypes";
import * as enums from "../Data/Enums";
import * as moment from "moment";
import * as colors from "chalk";
import * as socketio from "socket.io-client";
import * as boardx from "./BoardHelper";
import BoardHelper = boardx.BoardHelper;
import { TS } from "./node_modules/typescript-linq/TS";

class Client {
    private socket: SocketIOClient.Socket;

    constructor() {
    }

    public Connect(): void {
        this.socket = socketio.connect("http://localhost:3000", { reconnection: true });

        this.setOnConnect();
        this.setOnUpdate();
    }

    public KeyPress(key : string): void {
        if (key == "w")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Up);
        if (key == "s")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Down);
        if (key == "a")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Left);
        if (key == "d")
            this.socket.emit(messageTypes.MessageTypes.ChangeDirection, enums.MoveDirection.Right);
    }
    
    private setOnConnect(): void {
        this.socket.on(messageTypes.MessageTypes.Connect, (server: SocketIOClient.Socket) => {
            console.log("Connected!");
        });
    }

    private setOnUpdate(): void {
        this.socket.on(messageTypes.MessageTypes.Update, (update: messages.Update) => {
            console.log('\x1Bc');
            //BoardHelper.DrawBoard(board);
            //console.log(update.Points.length + " ::: " + colors.red(this.socket.id) + " ::: " + colors.blue(Date.now()));

            var points = new TS.Collections.List<messages.Point>(true);
            points.add(update.Points);

            for (let row = 0; row < update.Height; row++) {
                var rowString = "";
                for (let col = 0; col < update.Width; col++) {
//                    if (points.any(p => p.X === col && p.Y === row))
//                        rowString += "#";
//                    else
//                        rowString += " ";
                    let found = false;
                    for (let p of update.Points) {
                        if (p.X === row && p.Y === col) {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        rowString += "#";
                    else
                        rowString += ".";
                }

                console.log(rowString);
            }

            this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
        });
    }
}

var client = new Client();
client.Connect();

(<any>process.stdin).setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (key: any) => {
    client.KeyPress(key);
});
