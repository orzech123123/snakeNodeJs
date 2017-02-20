/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";

import * as interfaces from "./Interfaces"
import IDrawable = interfaces.IDrawable;

export class SnakeSegment implements IDrawable {
    private x : number;
    private y : number;

    constructor(segment?: SnakeSegment) {
        if(segment != null)
            this.MoveSegment(segment);
    }

    public Random(width : number, height : number) {
        this.x = this.randomIntInc(0, width - 1);
        this.y = this.randomIntInc(0, height - 1);
    }

    public MoveSegment(segment: SnakeSegment) {
        this.x = segment.GetX();
        this.y = segment.GetY();
    }

    public MoveDirection(direction : enums.MoveDirection) {
        if (direction === enums.MoveDirection.Up)
            this.y--;
        if (direction === enums.MoveDirection.Down)
            this.y++;
        if (direction === enums.MoveDirection.Left)
            this.x--;
        if (direction === enums.MoveDirection.Right)
            this.x++;
    }

    GetX(): number { return this.x; }

    GetY(): number { throw this.y; }

    private randomIntInc(low : number, high : number) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    
    GetCoordinations(): Array<messages.Point> { return [new messages.Point(this.x, this.y)]; }
}