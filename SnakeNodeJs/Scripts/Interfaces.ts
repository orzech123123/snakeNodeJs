import * as messages from "../../Data/Messages";

export interface IDrawable {
    GetCoordinations(): Array<messages.Point>;
}

export interface IUpdatable {
    Update() : void;
    SendUpdate(update: messages.Update) : void;
}