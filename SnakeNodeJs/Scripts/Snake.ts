/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
/// <reference path="../node_modules/linq-to-type/src/lib.es6.d.ts"/>

require("../node_modules/linq-to-type/src/linq-to-type.js");
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";
import * as h from "./Helpers";

import * as interfaces from "./Interfaces"
import * as ss from "./SnakeSegment"
import IDrawable = interfaces.IDrawable;
import IUpdatable = interfaces.IUpdatable;

export class Snake implements IDrawable, IUpdatable {
    private lastUpdateAck: number;
    private direction : enums.MoveDirection;
    private socket: SocketIO.Socket;
    public Head: ss.SnakeSegment;

    private segmentsToAdd: Array<messages.Point> = [];
    
    constructor(socket: SocketIO.Socket, private width: number, private height: number) {
        this.socket = socket;

        this.setOnUpdateAck();
        this.setOnChangeDirection();

        this.Recreate();
    }
    
    public AddSegment() {
        this.segmentsToAdd.push(this.Head.GetCoordinations()[0]);
    }

    public Recreate() {
        var segment = new ss.SnakeSegment();
        segment.Random(this.width, this.height);
        this.Head = segment;
        this.direction = h.MathHelper.RandomIntInc(1, 4);
        this.segmentsToAdd = [];
    }

    public SendUpdate(update: messages.Update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    }

    public GetId() {
        return this.socket.id;
    }

    public Update() {
        this.move();
        this.tryAddSegment();
    }

    private tryAddSegment() {
        for (let segment of this.segmentsToAdd) {
            if (!h.CollisionHelper.CollisionPoints(this.GetCoordinations(), [segment]).any()) {
                let snakeSegment = this.Head;
                while (snakeSegment.Next != null)
                    snakeSegment = snakeSegment.Next;
                
                var newSegment = new ss.SnakeSegment(new messages.Point(segment.X, segment.Y));
                snakeSegment.Next = newSegment;

                this.segmentsToAdd.splice(this.segmentsToAdd.indexOf(segment), 1);
            }
        }
    }

    public GetSocket(): SocketIO.Socket {
        return this.socket;
    }

    private move() {
        this.Head.MoveDirection(this.direction);
    }
    
    private setOnUpdateAck(): void {
        this.socket.on(messageTypes.MessageTypes.UpdateAck, () => {
            this.lastUpdateAck = Date.now();
        });
    }

    private setOnChangeDirection(): void {
        this.socket.on(messageTypes.MessageTypes.ChangeDirection, (direction : enums.MoveDirection) => {
            if (direction === enums.MoveDirection.Up && (this.direction === enums.MoveDirection.Left || this.direction == enums.MoveDirection.Right))
                this.setDirection(direction);
            if (direction === enums.MoveDirection.Down && (this.direction === enums.MoveDirection.Left || this.direction == enums.MoveDirection.Right))
                this.setDirection(direction);
            if (direction === enums.MoveDirection.Left && (this.direction === enums.MoveDirection.Up || this.direction == enums.MoveDirection.Down))
                this.setDirection(direction);
            if (direction === enums.MoveDirection.Right && (this.direction === enums.MoveDirection.Up || this.direction == enums.MoveDirection.Down))
                this.setDirection(direction);
        });
    }
    
    private setDirection(direction: enums.MoveDirection) {
        this.direction = direction;
    }
    
    public GetCoordinations(): messages.Point[] {
        var result = new Array<messages.Point>();
        var segment = this.Head;
        while (segment != null) {
            result.push(segment.GetCoordinations()[0]);
            segment = segment.Next;
        }
        return result;
    }
}