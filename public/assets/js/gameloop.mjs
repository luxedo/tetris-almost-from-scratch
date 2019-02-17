/*
tetris-almost-from-scratch
This is an attempt of making the game tetris using modern programming languages

Copyright (C) 2019  Luiz Eduardo Amaral - <luizamaral306@gmail.com>

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
    this.playerKeys = Object.assign({
      drop: "ArrowDown",
      down: "ArrowDown",
      up: "ArrowUp",
      left: "ArrowLeft",
      right: "ArrowRight",
      hardDrop: " ",
      sLeft: "z",
      sRight: "x",
      sRight2: "ArrowUp",
      confirm: "Enter",
      backspace: "Backspace",
      spacebar: " ",
      pause: "Esc",
      pause2: "Escape"
    }, gs.alphabeth);
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

class SoundStore {
  constructor(files) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this._mute = false;
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.files = files;
    this.buffers = {};
    this.sounds = {};
    Object.keys(files).forEach(name => {
      fetch(files[name])
      .then(response => response.arrayBuffer())
      .then(buffer => {
        this.context.decodeAudioData(buffer, decodedData => {
          this.buffers[name] = decodedData;
        });
      });
    });
  }
  createSource(name) {
    return new Promise((resolve, reject) => {
      const source = this.context.createBufferSource();
      source.buffer = this.buffers[name];
      source.connect(this.gainNode);
      this.sounds[name] = source;
      source.onended = (event) => {
        delete this.sounds[name];
      };
      resolve();
    });
  }
  play(name) {
    return new Promise((resolve, reject) => {
      if (this.mute) return;
      if (name in this.sounds) {
        delete this.sounds[name];
      }
      if (name in this.files) {
        if (!(name in this.buffers)) {
        } else {
          this.createSource(name).then(() => {
            try {
              this.sounds[name].start(0);
            } catch (err){
              // console.log(err);
            }
            resolve();
          });
        }
      } else {
      }
    });
  }
  loop(name) {
    if (this.mute) return;
    this.play(name).then(() => {
      this.sounds[name].loop = true;
    });
  }
  stop(name) {
    if (name in this.sounds) {
      this.sounds[name].stop();
      return true;
    }
    return false;
  }
  isPlaying(name) {
    return name in this.sounds;
  }
  get mute() {
    return this._mute;
  }
  set mute(val) {
    this._mute = val;
    this.gainNode.gain.value = val?0:1;
  }
}

// Game Class
export class Game {
  constructor(firestore) {
    this.firestore = firestore;
    this.fps = 30;
    this.width = 800;
    this.height = 600;

    this.nextUpdate = 0;

    this.keys = new Key();

    const audioFiles = {
      theme: "assets/sounds/theme.mp3",
      gameover: "assets/sounds/gameover.mp3",
      blip: "assets/sounds/275897__n-audioman__blip.wav",
      break: "assets/sounds/270332__littlerobotsoundfactory__hit-03.wav",
      hit: "assets/sounds/391668__jeckkech__hit.wav",
    };
    this.sounds = new SoundStore(audioFiles);

    this.canvas = document.createElement("canvas"); // Create canvas
    this.canvas.setAttribute("id", "game");
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    document.getElementById("game-frame").appendChild(this.canvas); // Add canvas to game-frame

    this.ctx = this.canvas.getContext("2d"); // Get canvas context
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    this.ctx.shadowBlur = isChrome?30:0;
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
