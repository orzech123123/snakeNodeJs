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
    private segments: Array<snakeSegment.SnakeSegment> = [];
    
    constructor(socket: SocketIO.Socket, width: number, height: number) {
        this.socket = socket;

        this.setOnUpdateAck();
        this.setOnChangeDirection();

        var segment = new snakeSegment.SnakeSegment();
        segment.Random(width, height);
        this.segments.push(segment);
        this.direction = enums.MoveDirection.Right;
    }

    public SendUpdate(update: messages.Update) {
        this.socket.emit(messageTypes.MessageTypes.Update, update);
    }

    public Update() {
        this.move();
    }

    public GetSocket(): SocketIO.Socket {
        return this.socket;
    }

    private move() {
        for (let segment of this.segments) {
            segment.MoveDirection(this.direction); //TODO ruszanie calej struktury lista 1-kier
        }
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
        return this.segments.selectMany(s => s.GetCoordinations());
    }
}