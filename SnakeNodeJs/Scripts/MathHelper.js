"use strict";
var MathHelper = (function () {
    function MathHelper() {
    }
    MathHelper.RandomIntInc = function (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    };
    return MathHelper;
}());
exports.MathHelper = MathHelper;
//# sourceMappingURL=MathHelper.js.map