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
        this.scorePanel = null;
        this.canvasContext = null;
        this.lastUpdate = [];
        this.dim = 20;
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
        this.scorePanel = this.elRef.nativeElement.querySelector('#scorePanel');
        this.canvas = this.elRef.nativeElement.querySelector('#canvas1');
        this.canvasContext = this.canvas.getContext("2d");
        this.socket.on("connect", function (server) {
            console.log("Connected");
        });
        this.socket.on("update", function (update) {
            if (_this.canvas.width == 0 && _this.canvas.height == 0) {
                var width = update.Width * _this.dim;
                var height = update.Height * _this.dim;
                _this.canvasContext.fillStyle = "black";
                _this.canvasContext.fillRect(0, 0, width, height);
                _this.canvas.width = width;
                _this.canvas.height = height;
            }
            _this.drawScore(update);
            _this.drawUpdate(update);
        });
        this.socket.emit("connectionAck", prompt());
    };
    AppComponent.prototype.drawColor = function (row, col, color) {
        var img = this.elRef.nativeElement.querySelector("#" + color);
        this.canvasContext.drawImage(img, col * this.dim, row * this.dim, this.dim, this.dim);
    };
    AppComponent.prototype.drawSlot = function (row, col, type) {
        //TODO
        //   if(this.lastUpdate[row][col] == type)
        //      return;
        this.drawColor(row, col, type);
        this.lastUpdate[row][col] = type;
    };
    AppComponent.prototype.drawScore = function (update) {
        var snakeScores = update.Snakes
            .select(function (s) { return new SnakeScore(s.Name, s.Score); })
            .sort(function (s1, s2) { return -(s1.score - s2.score); });
        var innerHtml = "<ol>";
        for (var _i = 0, snakeScores_1 = snakeScores; _i < snakeScores_1.length; _i++) {
            var snake = snakeScores_1[_i];
            innerHtml += ("<li>" + snake.name + " - " + snake.score + "</li>");
        }
        innerHtml += "</ol>";
        this.scorePanel.innerHTML = innerHtml;
    };
    AppComponent.prototype.drawUpdate = function (update) {
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(0, 0, 800, 600);
        var _loop_1 = function(row) {
            var _loop_2 = function(col) {
                if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                    this_1.drawSlot(row, col, "blue");
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
                    this_1.drawSlot(row, col, "green");
                else if (isMine)
                    this_1.drawSlot(row, col, "red");
                else if (isOther)
                    this_1.drawSlot(row, col, "yellow");
                else
                    this_1.drawSlot(row, col, "white");
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
            template: "\n  <canvas id=\"canvas1\" width=\"0\" height=\"0\"></canvas>\n  <div style=\"color: white\" id=\"scorePanel\"></div>\n  <img src=\"white.png\" id=\"white\" style=\"display: none;\" />\n  <img src=\"green.png\" id=\"green\" style=\"display: none;\" />\n  <img src=\"red.png\" id=\"red\" style=\"display: none;\" />\n  <img src=\"yellow.png\" id=\"yellow\" style=\"display: none;\" />\n  <img src=\"blue.png\" id=\"blue\" style=\"display: none;\" />"
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
var SnakeScore = (function () {
    function SnakeScore(name, score) {
        this.name = name;
        this.score = score;
    }
    return SnakeScore;
}());
//# sourceMappingURL=app.component.js.map