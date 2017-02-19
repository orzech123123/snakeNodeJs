"use strict";
var MessageTypes = (function () {
    function MessageTypes() {
    }
    Object.defineProperty(MessageTypes, "Connect", {
        get: function () { return "connect"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageTypes, "Connection", {
        get: function () { return "connection"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageTypes, "Update", {
        get: function () { return "update"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageTypes, "UpdateAck", {
        get: function () { return "updateAck"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageTypes, "ChangeDirection", {
        get: function () { return "changeDirection"; },
        enumerable: true,
        configurable: true
    });
    return MessageTypes;
}());
exports.MessageTypes = MessageTypes;
//# sourceMappingURL=MessageTypes.js.map