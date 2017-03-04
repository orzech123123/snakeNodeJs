/// <reference path="./Scripts/typings/node/node.d.ts"/>
/// <reference path="./node_modules/retyped-express-tsd-ambient/express.d.ts"/>
/// <reference path="./node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
/// <reference path="../Data/Messages.ts"/>
/// <reference path="../Data/MessageTypes.ts"/>
/// <reference path="./node_modules/linq-to-type/src/lib.es6.d.ts"/>

require("./node_modules/linq-to-type/src/linq-to-type.js");
import * as http from "http";
import * as express from "express";
import * as socketio from "socket.io";
import * as messages from "../Data/Messages";
import * as messageTypes from "../Data/MessageTypes";
import * as snake from "./Scripts/Snake";
import Snake = snake.Snake;

class Server {
    public snakes: Array<snake.Snake> = [];
    private application: express.Express;
    private server: http.Server;
    private socket: SocketIO.Server;

    private width = 50;
    private height = 20;

    constructor() {
    }

    public Start(): void {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);

        this.setOnConnection();

        this.listen();

        this.setLoop();
    }

    private setOnConnection() {
        this.socket.on(messageTypes.MessageTypes.Connection, (client: SocketIO.Socket) => {
            console.log("Client connected: " + client.id);

            var snake = new Snake(client, this.width, this.height);
            this.snakes.push(snake);
        });
    }

    private listen(): void {
        this.server.listen(3000, () => {
            console.log("listening on *:3000");
        });
    }

    private update(): void {
        for (let snake of this.snakes) {
            snake.Update();
        }

        //TODO logic
        
        var update = new messages.Update();
        
        update.Snakes = this.snakes.select(s => new messages.SnakeDto(s.GetCoordinations(), s.GetId()));
        update.Width = this.width;
        update.Height = this.height;

        for (let snake of this.snakes) {
            snake.SendUpdate(update);
        }
    }

    private setLoop(): void {
        setInterval(() => {
            this.update();
        }, 100);
    }
}

var server = new Server();
server.Start();