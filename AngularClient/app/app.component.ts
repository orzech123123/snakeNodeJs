/// <reference path="../node_modules/@types/socket.io-client/index.d.ts" /> 
/// <reference path="../node_modules/linq-to-type/src/lib.es6.d.ts" /> 

import { Component, ElementRef, HostListener } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'my-app',
  template: `
  <canvas id="canvas1" width="0" height="0"></canvas>
  <div style="color: white" id="scorePanel"></div>
  <img src="white.png" id="white" style="display: none;" />
  <img src="green.png" id="green" style="display: none;" />
  <img src="red.png" id="red" style="display: none;" />
  <img src="yellow.png" id="yellow" style="display: none;" />
  <img src="blue.png" id="blue" style="display: none;" />`
})


export class AppComponent 
{ 
  socket : SocketIOClient.Socket = null;
  canvas : HTMLCanvasElement = null;
  scorePanel : HTMLElement = null;
  canvasContext : CanvasRenderingContext2D = null;
  lastUpdate = [];
  dim = 20;

  constructor(private elRef:ElementRef) {
    for(let row = 0; row < 1000; row++)
    {
      let rowUpdate = [];
      for(let col = 0; col < 1000; col++)
        rowUpdate.push(" ");
      this.lastUpdate.push(rowUpdate);
    }
  }
  
  ngAfterViewInit()
  {
    this.socket = io.connect("http://localhost:3000", { reconnection: true });
    this.scorePanel = this.elRef.nativeElement.querySelector('#scorePanel');
    this.canvas = <HTMLCanvasElement>this.elRef.nativeElement.querySelector('#canvas1');
    this.canvasContext = this.canvas.getContext("2d");

    this.socket.on("connect", (server: SocketIOClient.Socket) => {
        console.log("Connected");
    });

    this.socket.on("update", (update) => {
      if(this.canvas.width == 0 && this.canvas.height == 0){
          let width = update.Width * this.dim;
          let height = update.Height * this.dim
          this.canvasContext.fillStyle = "black";
          this.canvasContext.fillRect(0, 0, width, height);
          this.canvas.width = width;
          this.canvas.height = height;
      }

      this.drawScore(update);
      this.drawUpdate(update);
    });

    this.socket.emit("connectionAck", prompt());
  }

  private drawColor(row : number, col : number, color : string)
  {
      var img= this.elRef.nativeElement.querySelector("#" + color);
      this.canvasContext.drawImage(img, col * this.dim, row * this.dim, this.dim, this.dim);
  }

  private drawSlot(row : number, col : number, type : string)
  {
    //TODO
    //   if(this.lastUpdate[row][col] == type)
    //      return;

      this.drawColor(row, col, type);
      this.lastUpdate[row][col] = type;
  }

  private drawScore(update)
  {
      var snakeScores = <Array<SnakeScore>>update.Snakes
      .select(s => new SnakeScore(s.Name, s.Score))
      .sort((s1, s2) => -(s1.score - s2.score));

      let innerHtml = "<ol>";
      for (var snake of snakeScores)
          innerHtml += ("<li>" + snake.name + " - " + snake.score + "</li>");
      innerHtml += "</ol>";

      this.scorePanel.innerHTML = innerHtml;  
  }

  private drawUpdate(update)
  {
      this.canvasContext.fillStyle="white";
      this.canvasContext.fillRect(0,0,800,600);

      for (let row = 0; row < update.Height; row++) {
          for (let col = 0; col < update.Width; col++) {
              if (col == 0 || col == update.Width - 1 || row == 0 || row == update.Height - 1) {
                  this.drawSlot(row, col, "blue");
                  continue;
              }

              var id = this.socket.id;

              var isCookie = update.Cookies.any(p => p.X == col && p.Y == row);

              var isMine = update.Snakes
                  .where(s => s.Id == id)
                  .selectMany(s => s.Points)
                  .any((p: any) => p.X == col && p.Y == row);

              var isOther = update.Snakes
                  .where(s => s.Id != id)
                  .selectMany(s => s.Points)
                  .any((p: any) => p.X == col && p.Y == row);

              if (isCookie)
                  this.drawSlot(row, col, "green");
              else if (isMine)
                  this.drawSlot(row, col, "red");
              else if (isOther)
                  this.drawSlot(row, col, "yellow");
              else
                  this.drawSlot(row, col, "white");
          }
      }
  }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log(event.key);

    if (event.key == "w")
        this.socket.emit("changeDirection", 1);
    if (event.key == "s")
        this.socket.emit("changeDirection", 2);
    if (event.key == "a")
        this.socket.emit("changeDirection", 3);
    if (event.key == "d")
        this.socket.emit("changeDirection", 4);
  }
}

class SnakeScore
{
    constructor(public name : string, public score : number)
    {

    }
}