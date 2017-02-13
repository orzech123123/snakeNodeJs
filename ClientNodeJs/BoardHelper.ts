/// <reference path="../Data/Messages.ts"/>

import * as messages from "../Data/Messages";

export class BoardHelper {
    static DrawBoard(board: messages.Board) {
        console.log(board.Width);
        console.log(board.Height);
    }
}