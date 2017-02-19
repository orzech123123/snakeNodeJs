/// <reference path="../Data/Messages.ts"/>

import * as messages from "../Data/Messages";
import * as color from "chalk";

export class BoardHelper {
    static DrawBoard(board: messages.Board) {
        console.log(board.Width);
        console.log(board.Height);
        console.log('\x1b[33m%s\x1b[0masd: ', "XXXXX");
        console.log(color.red('Text in red') + color.white('Text in red') + color.blue('Text in red'));
    }
}