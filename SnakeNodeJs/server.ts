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
import * as h from "./Scripts/Helpers";
import * as snake from "./Scripts/Snake";
import Snake = snake.Snake;

class Server {
    public snakes: Array<snake.Snake> = [];
    private application: express.Express;
    private server: http.Server;
    private socket: SocketIO.Server;

    private width = 50;
    private height = 20;

    private cookies: Array<messages.Point> = [];
    private cookiesCount = 5;

    constructor() {
    }

    public Start(): void {
        this.application = express();
        this.server = http.createServer(this.application);
        this.socket = socketio(this.server);

        this.setOnConnection();

        this.listen();

        this.setLoop();

        this.RecreateCookies();
    }

    public RecreateCookies() {
        let toCreate = this.cookiesCount - this.cookies.length;
        
        while (toCreate > 0) {
            var point = new messages.Point(h.MathHelper.RandomIntInc(1, this.width - 2), h.MathHelper.RandomIntInc(1, this.height - 2));
            var snakeCollisions = h.CollisionHelper.CollisionPoints(<any>this.snakes.selectMany(s => s.GetCoordinations()), [point]);
            var cookieCollisions = h.CollisionHelper.CollisionPoints(this.cookies, [point]);

            if (!snakeCollisions.any() && !cookieCollisions.any())
                this.cookies.push(point);

            toCreate--;
        }
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

    private processCollisions() {
        for (let snake of this.snakes) {
            let head = snake.Head;
            let next = snake.Head.Next;

            while (!!next) {
                if (h.CollisionHelper.CollisionPoints(head.GetCoordinations(), next.GetCoordinations()).any()) {
                    snake.Recreate();
                    break;
                }

                next = next.Next;
            }
        }

        for (let snake of this.snakes) {
            for (let snake2 of this.snakes) {
                if (snake.GetId() == snake2.GetId())
                    continue;

                if (h.CollisionHelper.CollisionPoints(snake.Head.GetCoordinations(), snake2.GetCoordinations()).any()) {
                    var tmpHead = snake.Head;
                    snake.Recreate();

                    if (h.CollisionHelper.CollisionPoints(tmpHead.GetCoordinations(), snake2.Head.GetCoordinations()).any()) {
                        snake2.Recreate();
                    }
                }
            }
        }

        for (let snake of this.snakes) {
            let collisionPoints = h.CollisionHelper.CollisionPoints(snake.Head.GetCoordinations(), this.cookies);
            if (collisionPoints.any()) {
                snake.AddSegment();
                let firstIndex = this.cookies.indexOf(collisionPoints[0]);
                let secondIndex = this.cookies.indexOf(collisionPoints[1]);
                if (firstIndex > -1)
                    this.cookies.splice(firstIndex, 1);
                if (secondIndex > -1)
                    this.cookies.splice(secondIndex, 1);
            }
        }
        this.RecreateCookies();
        
        for (let snake of this.snakes) {
            if (snake.GetCoordinations().any(p => p.X == 0 || p.X == this.width - 1 || p.Y == 0 || p.Y == this.height - 1)) {
                snake.Recreate();
            }
        }
    }

    private update(): void {
        for (let snake of this.snakes) {
            snake.Update();
        }
        
       this.processCollisions();
        
        var update = new messages.Update();
        
        update.Snakes = this.snakes.select(s => new messages.SnakeDto(s.GetCoordinations(), s.GetId()));
        update.Width = this.width;
        update.Height = this.height;
        update.Cookies = this.cookies;

        for (let snake of this.snakes) {
            snake.SendUpdate(update);
        }
    }

    private setLoop(): void {
        setInterval(() => {
            this.update();
        }, 150);
    }
}

var server = new Server();
server.Start();