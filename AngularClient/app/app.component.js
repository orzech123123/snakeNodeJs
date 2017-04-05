/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 
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
    function AppComponent() {
        var _this = this;
        this.self = this;
        this.first = { content: 'Angular 2 Start' };
        this.color = 'green';
        this.xx = 22;
        this.socket = null;
        this.socket = io.connect("http://localhost:3000", { reconnection: true });
        this.socket.on("connect", function (server) {
            console.log("Connected!");
        });
        this.socket.on("update", function (update) {
            console.log(update);
        });
        setInterval(function () {
            _this.socket.emit("changeDirection", Math.floor((Math.random() * 4) + 1));
        }, 2000);
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h2>{{first.content}}</h2>\n    <h2 [innerText]=\"xx\"></h2>\n    <h1 [style.color]=\"color\">{{first.content}}</h1>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map