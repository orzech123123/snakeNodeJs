/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";

import * as interfaces from "./Interfaces"
import IDrawable = interfaces.IDrawable;

export class SnakeSegment implements IDrawable {
    private x : number;
    private y: number;
    public Next : SnakeSegment;

    constructor(point?: messages.Point) {
        if (point != null) {
            this.x = point.X;
            this.y = point.Y;
        }
//        if(segment != null)
//            this.MoveSegment(segment);
    }

    public Random(width : number, height : number) {
        this.x = this.randomIntInc(0, width - 1);
        this.y = this.randomIntInc(0, height - 1);
    }

    public MoveSegment(segment: SnakeSegment) {
        if (this.Next != null)
            this.Next.MoveSegment(this);

        this.x = segment.GetCoordinations()[0].X;
        this.y = segment.GetCoordinations()[0].Y;
    }

    public MoveDirection(direction: enums.MoveDirection) {
        if (this.Next != null)
            this.Next.MoveSegment(this);

        if (direction === enums.MoveDirection.Up)
            this.y--;
        if (direction === enums.MoveDirection.Down)
            this.y++;
        if (direction === enums.MoveDirection.Left)
            this.x--;
        if (direction === enums.MoveDirection.Right)
            this.x++;
    }
    
    private randomIntInc(low : number, high : number) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    
    GetCoordinations(): Array<messages.Point> { return [new messages.Point(this.x, this.y)]; }
}