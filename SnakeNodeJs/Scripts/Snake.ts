/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
/// <reference path="../node_modules/linq-to-type/src/lib.es6.d.ts"/>

require("../node_modules/linq-to-type/src/linq-to-type.js");
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";

import * as interfaces from "./Interfaces"
import * as snakeSegment from "./SnakeSegment"
import IDrawable = interfaces.IDrawable;
import IUpdatable = interfaces.IUpdatable;

export class Snake implements IDrawable, IUpdatable {
    private lastUpdateAck: number;
    private direction : enums.MoveDirection;
    private socket: SocketIO.Socket;
    private head: snakeSegment.SnakeSegment;
    
    constructor(socket: SocketIO.Socket, width: number, height: number) {
        this.socket = socket;

        this.setOnUpdateAck();
        this.setOnChangeDirection();

        var segment = new snakeSegment.SnakeSegment();
        segment.Random(width, height);
        var next = new snakeSegment.SnakeSegment(segment.GetCoordinations()[0]);
        segment.Next = next;
        var next2 = new snakeSegment.SnakeSegment(next.GetCoordinations()[0]);
        next.Next = next2;
        var next3 = new snakeSegment.SnakeSegment(next2.GetCoordinations()[0]);
        next2.Next = next3;
        var next4 = new snakeSegment.SnakeSegment(next3.GetCoordinations()[0]);
        next3.Next = next4;

        this.head = segment;
        this.direction = enums.MoveDirection.Right;
    }

    public SendUpdate(update: messages.Update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    }

    public GetId() {
        return this.socket.id;
    }

    public Update() {
        this.move();
    }

    public GetSocket(): SocketIO.Socket {
        return this.socket;
    }

    private move() {
        this.head.MoveDirection(this.direction);
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
        console.log(this.socket.id + "DIR:: " + direction);
    }
    
    public GetCoordinations(): messages.Point[] {
        var result = new Array<messages.Point>();
        var segment = this.head;
        while (segment != null) {
            result.push(segment.GetCoordinations()[0]);
            segment = segment.Next;
        }
        return result;
    }
}