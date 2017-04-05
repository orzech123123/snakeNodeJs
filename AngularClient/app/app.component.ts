/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 

import { Component } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'my-app',
 template: `
    <h2>{{first.content}}</h2>
    <h2 [innerText]="xx"></h2>
    <h1 [style.color]="color">{{first.content}}</h1>
  `
})
export class AppComponent { 
    self = this;
    first = { content: 'Angular 2 Start' };
    color = 'green';

    xx : number= 22 ;

    socket : SocketIOClient.Socket = null;

    constructor()
    {
      this.socket = io.connect("http://localhost:3000", { reconnection: true });
      this.socket.on("connect", (server: SocketIOClient.Socket) => {
            console.log("Connected!");
        });

        this.socket.on("update", (update) => {
          console.log(update);
        });

        setInterval(() =>{
            
            this.socket.emit("changeDirection", Math.floor((Math.random() * 4) + 1));
        }, 2000);
    }
}
