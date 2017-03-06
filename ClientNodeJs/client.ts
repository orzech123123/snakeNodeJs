/// <reference path="./node_modules/retyped-socket.io-client-tsd-ambient/socket.io-client.d.ts"/>
/// <reference path="./node_modules/retyped-moment-tsd-ambient/moment-node.d.ts"/>
/// <reference path="../Data/Messages.ts"/>
/// <reference path="../Data/MessageTypes.ts"/>
/// <reference path="../Data/Enums.ts"/>
/// <reference path="./node_modules/linq-to-type/src/lib.es6.d.ts"/>

require("./node_modules/linq-to-type/src/linq-to-type.js");
import * as messages from "../Data/Messages";
import * as messageTypes from "../Data/MessageTypes";
import * as enums from "../Data/Enums";
import * as moment from "moment";
import * as colors from "chalk";
import * as socketio from "socket.io-client";

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
            this.redraw(update);
            this.socket.emit(messageTypes.MessageTypes.UpdateAck, 1);
        });
    }

    private clearConsole(): void {
        console.log('\x1Bc');
    }

    private drawUpdate(update : messages.Update): void {
        for (let row = 0; row < update.Height; row++) {
            var rowString = "";
            for (let col = 0; col < update.Width; col++) {
                if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                    rowString += colors.blue("o");
                    continue;
                }

                var id = this.socket.id;

                var isCookie = update.Cookies.any(p => p.X == col && p.Y == row);

                var isMine = update.Snakes
                    .where(s => s.Id == id)
                    .selectMany(s => s.Points)
                    .any((p: any) => p.X == col && p.Y == row);

                var isOther = update.Snakes
                    .where(s => s.Id != id)
                    .selectMany(s => s.Points)
                    .any((p: any) => p.X == col && p.Y == row);

                if (isCookie)
                    rowString += colors.green("x");
                else if (isMine)
                    rowString += colors.red("#");
                else if (isOther)
                    rowString += colors.yellow("#");
                else
                    rowString += " ";
            }

            console.log(rowString);
        }
    }

    private redraw(update: messages.Update)
    {
        this.clearConsole();
        this.drawUpdate(update);
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

setTimeout(() => {
        return;
    var x = 1;
    setInterval(() => {
            if (x == 1)
                client.KeyPress("s");
            else if (x == 2)
                client.KeyPress("a");
            else if (x == 3)
                client.KeyPress("w");
            else if (x == 4)
                client.KeyPress("d");

            x++;

            if (x == 5)
                x = 1;
        },
        500);
    },
    3000);
