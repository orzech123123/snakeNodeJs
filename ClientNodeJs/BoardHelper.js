"use strict";
var color = require("chalk");
var BoardHelper = (function () {
    function BoardHelper() {
    }
    BoardHelper.DrawBoard = function (board) {
        console.log(board.Width);
        console.log(board.Height);
        console.log('\x1b[33m%s\x1b[0masd: ', "XXXXX");
        console.log(color.red('Text in red') + color.white('Text in red') + color.blue('Text in red'));
    };
    return BoardHelper;
}());
exports.BoardHelper = BoardHelper;
//# sourceMappingURL=BoardHelper.js.map