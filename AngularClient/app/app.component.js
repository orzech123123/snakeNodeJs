/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 
/// <reference path="../node_modules/linq-to-type/src/lib.es6.d.ts" /> 
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var io = require("socket.io-client");
var AppComponent = (function () {
    function AppComponent(elRef) {
        this.elRef = elRef;
        this.socket = null;
        this.canvas = null;
        this.canvasContext = null;
        this.lastUpdate = [];
        for (var row = 0; row < 1000; row++) {
            var rowUpdate = [];
            for (var col = 0; col < 1000; col++)
                rowUpdate.push(" ");
            this.lastUpdate.push(rowUpdate);
        }
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.socket = io.connect("http://localhost:3000", { reconnection: true });
        this.canvas = this.elRef.nativeElement.querySelector('#canvas1');
        this.canvasContext = this.canvas.getContext("2d");
        this.socket.on("connect", function (server) {
            console.log("Connected");
        });
        this.socket.on("update", function (update) {
            _this.drawUpdate(update);
        });
    };
    AppComponent.prototype.drawColor = function (row, col, color) {
        var dim = 10;
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(col * dim, row * dim, dim, dim);
    };
    AppComponent.prototype.drawSlot = function (row, col, type) {
        if (this.lastUpdate[row][col] == type)
            return;
        switch (type) {
            case "x": {
                this.drawColor(row, col, "green");
                break;
            }
            case "o": {
                this.drawColor(row, col, "blue");
                break;
            }
            case "red#": {
                this.drawColor(row, col, "red");
                break;
            }
            case "yellow#": {
                this.drawColor(row, col, "yellow");
                break;
            }
            case " ": {
                this.drawColor(row, col, "black");
                break;
            }
        }
        this.lastUpdate[row][col] = type;
    };
    AppComponent.prototype.drawUpdate = function (update) {
        var _loop_1 = function(row) {
            var _loop_2 = function(col) {
                if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                    this_1.drawSlot(row, col, "o");
                    return "continue";
                }
                id = this_1.socket.id;
                isCookie = update.Cookies.any(function (p) { return p.X == col && p.Y == row; });
                isMine = update.Snakes
                    .where(function (s) { return s.Id == id; })
                    .selectMany(function (s) { return s.Points; })
                    .any(function (p) { return p.X == col && p.Y == row; });
                isOther = update.Snakes
                    .where(function (s) { return s.Id != id; })
                    .selectMany(function (s) { return s.Points; })
                    .any(function (p) { return p.X == col && p.Y == row; });
                if (isCookie)
                    this_1.drawSlot(row, col, "x");
                else if (isMine)
                    this_1.drawSlot(row, col, "red#");
                else if (isOther)
                    this_1.drawSlot(row, col, "yellow#");
                else
                    this_1.drawSlot(row, col, " ");
            };
            for (var col = 0; col < update.Width; col++) {
                var state_1 = _loop_2(col);
                if (state_1 === "continue") continue;
            }
        };
        var this_1 = this;
        var id, isCookie, isMine, isOther;
        for (var row = 0; row < update.Height; row++) {
            _loop_1(row);
        }
    };
    AppComponent.prototype.keyboardInput = function (event) {
        console.log(event.key);
        if (event.key == "w")
            this.socket.emit("changeDirection", 1);
        if (event.key == "s")
            this.socket.emit("changeDirection", 2);
        if (event.key == "a")
            this.socket.emit("changeDirection", 3);
        if (event.key == "d")
            this.socket.emit("changeDirection", 4);
    };
    __decorate([
        core_1.HostListener('window:keydown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], AppComponent.prototype, "keyboardInput", null);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<canvas id=\"canvas1\" width=\"1280\" height=\"500\"></canvas>"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map