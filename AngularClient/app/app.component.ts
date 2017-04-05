/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 

import { Component, ElementRef, HostListener } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'my-app',
  template: `
    <h2>{{first.content}}</h2>
    <h2 [innerText]="xx"></h2>
    <h1 [style.color]="color">{{first.content}}</h1>
    <canvas id="canvas1" width="200" height="100"></canvas>
  `,
  
})

export class AppComponent 
{ 
  self = this;
  first = { content: 'Angular 2 Start' };
  color = 'green';

  xx : number= 22 ;

  socket : SocketIOClient.Socket = null;
  canvas = null;

  constructor(private elRef:ElementRef) {}
  
  ngAfterViewInit()
  {
    this.socket = io.connect("http://localhost:3000", { reconnection: true });
    var canvas = <HTMLCanvasElement>this.elRef.nativeElement.querySelector('#canvas1');

    this.socket.on("connect", (server: SocketIOClient.Socket) => {
        console.log("Connectedddd!");
    });

    this.socket.on("update", (update) => {
      //console.log(update);
    });

    setInterval(() => {
        this.socket.emit("changeDirection", Math.floor((Math.random() * 4) + 1));

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(" + Math.floor((Math.random() * 255) + 1) + ", 0, 255)";
        ctx.fillRect(0,0,150,75);
    }, 2000);
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log(event.key);
  }
}
