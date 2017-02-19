import * as messages from "../../Data/Messages";

export interface ICoordination {
    GetCoordination(): messages.Point;
}

export interface ICoordinationColletion {
    GetCoordinations(): Array<messages.Point>;
}

export interface IUpdatable {
    Update() : void;
    SendUpdate(update: messages.Update) : void;
}