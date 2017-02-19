/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";

import * as interfaces from "./Interfaces"
import * as snakeSegment from "./SnakeSegment"
import ICoordinationColletion = interfaces.ICoordinationColletion;
import IUpdatable = interfaces.IUpdatable;

export class Snake implements ICoordinationColletion, IUpdatable {
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
        for (var segment of this.segments) {
            
        }
    }
    
    private setOnUpdateAck(): void {
        this.socket.on(messageTypes.MessageTypes.UpdateAck, () => {
            this.lastUpdateAck = Date.now();
        });
    }

    private setOnChangeDirection(): void {
        this.socket.on(messageTypes.MessageTypes.ChangeDirection, (direction : enums.MoveDirection) => {
            this.direction = direction;

            console.log(this.socket.id + "DIR:: " + direction);
        });
    }
    
    public GetCoordinations(): messages.Point[] {
        let result = new Array<messages.Point>();

        for (var segment of this.segments) {
            result.push(segment.GetCoordination());
        }

        return result;
    }
}