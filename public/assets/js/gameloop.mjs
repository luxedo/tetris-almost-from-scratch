/*
tetris-almost-from-scratch
This is an attempt of making the game tetris using modern programming languages

Copyright (C) 2017  Luiz Eduardo Amaral - <luizamaral306@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import * as gs from './gameScreen.mjs';

class Key {
  constructor() {
    this._pressed = {};
    this._active = {};
    this.playerKeys = {
      drop: "ArrowDown",
      down: "ArrowDown",
      up: "ArrowUp",
      left: "ArrowLeft",
      right: "ArrowRight",
      hardDrop: " ",
      sLeft: "z",
      sRight: "x",
      confirm: "Enter"
    };
    for (let key in this.playerKeys) {
      this._active[this.playerKeys[key].toLowerCase()] = true;
    }
    window.addEventListener('keyup', (event) => {
      this.onKeyup(event);
    }, false);
    window.addEventListener('keydown', (event) => {
      this.onKeydown(event);
    }, false);
  }
  onKeydown(event) {
    if (!(event.key.toLowerCase() in this._pressed)) {
      this._pressed[event.key.toLowerCase()] = Date.now();
    }
  }
  onKeyup(event) {
    delete this._pressed[event.key.toLowerCase()];
    this._active[event.key.toLowerCase()] = true;
  }
  isDown(keyName) {
    const keyCode = this.playerKeys[keyName].toLowerCase();
    return !!this._pressed[keyCode];
  }
  isActive(keyName) {
    const keyCode = this.playerKeys[keyName].toLowerCase();
    const active = this._active[keyCode] && this.isDown(keyName);
    if (active) {
      delete this._active[keyCode];
    }
    return active;
  }
  isHolding(keyName, time) {
    const keyCode = this.playerKeys[keyName].toLowerCase();
    if (Date.now() >= this._pressed[keyCode] + time) {
      this._pressed[keyCode] = Date.now();
      return true;
    }
    return false;
  }
}

// preventDefault
window.addEventListener("keydown", function(event) {
  if ([32, 37, 38, 39, 40, 13].indexOf(event.keyCode) > -1) {
    event.preventDefault();
  }
}, false);

// sound factory
function soundFactory(audio, start, stop) {
  return () => {
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = start;
    }, stop);
  };
}

// Game Class
export class Game {
  constructor() {
    this.fps = 30;
    this.width = 800;
    this.height = 600;

    this.nextUpdate = 0;

    this.keys = new Key();

    this.canvas = document.createElement("canvas"); // Create canvas
    this.canvas.setAttribute("id", "game");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    document.getElementById("game-frame").appendChild(this.canvas); // Add canvas to game-frame

    this.ctx = this.canvas.getContext("2d"); // Get canvas context
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 30;
  }
  start() {
    let screen = new gs.MenuScreen(this);
    this.changeScreen(screen);
    this.run();
  }
  changeScreen(screen) {
    this.screen = screen;
    this.screen.init();
  }
  // Gameloop
  run() {
    if (Date.now() >= this.nextUpdate) {
      this.nextUpdate = Date.now() + 1000 / this.fps;
      this.screen.update();
      this.screen.draw();
      window.requestAnimationFrame(() => this.run());
    } else {
      setTimeout(() => this.run(), 1000 / this.fps);
    }
  }
}
