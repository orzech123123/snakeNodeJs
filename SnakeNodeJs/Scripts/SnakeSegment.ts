/// <reference path="./Interfaces.ts"/>
/// <reference path="../node_modules/retyped-socket.io-tsd-ambient/socket.io.d.ts"/>
import * as messageTypes from "../../Data/MessageTypes";
import * as messages from "../../Data/Messages";
import * as enums from "../../Data/Enums";

import * as interfaces from "./Interfaces"
import ICoordination = interfaces.ICoordination;
import IUpdatable = interfaces.IUpdatable;

export class SnakeSegment implements ICoordination {
    private x : number;
    private y : number;

    constructor(segment?: SnakeSegment) {
        if(segment != null)
            this.Move(segment);
    }

    public Random(width : number, height : number) {
        this.x = this.randomIntInc(0, width - 1);
        this.y = this.randomIntInc(0, height - 1);
    }

    public Move(segment: SnakeSegment) {
        this.x = segment.GetX();
        this.y = segment.GetY();
    }

    GetX(): number { return this.x; }

    GetY(): number { throw this.y; }

    private randomIntInc(low : number, high : number) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }

    GetCoordination(): messages.Point { return new messages.Point(this.x, this.y); }
}