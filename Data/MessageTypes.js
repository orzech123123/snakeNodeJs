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
    Object.defineProperty(MessageTypes, "BoardSc", {
        get: function () { return "boardSc"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageTypes, "BoardAcknowledgeCs", {
        get: function () { return "boardAcknowledgeCs"; },
        enumerable: true,
        configurable: true
    });
    return MessageTypes;
}());
exports.MessageTypes = MessageTypes;
//# sourceMappingURL=MessageTypes.js.map