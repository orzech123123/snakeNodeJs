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
var CollisionHelper = (function () {
    function CollisionHelper() {
    }
    CollisionHelper.CollisionPoints = function (firstSet, secondSet) {
        for (var _i = 0, firstSet_1 = firstSet; _i < firstSet_1.length; _i++) {
            var first = firstSet_1[_i];
            for (var _a = 0, secondSet_1 = secondSet; _a < secondSet_1.length; _a++) {
                var second = secondSet_1[_a];
                if (first.X == second.X && first.Y == second.Y)
                    return [first, second];
            }
        }
        return [];
    };
    return CollisionHelper;
}());
exports.CollisionHelper = CollisionHelper;
//# sourceMappingURL=Helpers.js.map