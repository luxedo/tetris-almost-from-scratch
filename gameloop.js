/*
hamurabi-almost-from-scratch
This is an attempt of making the game hamurabi using modern programming languages

Copyright (C) 2016  Luiz Eduardo Amaral - <luizamaral306@gmail.com>

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
"use strict";

// preventDefault
window.addEventListener("keydown", function (event) {
  if ([32, 37, 38, 39, 40, 13].indexOf(event.keyCode) > -1) {
    event.preventDefault();
  }
}, false);

// Game object
let Game = {
  fps: 60,
  width: 800,
  height: 600,
  year: 1,
  starved: 0,
  came: 5,
  population: 100,
  acres: 1000,
  planted: 1000,
  harvest: 3,
  rats: 200,
  store: 2800,
  trade: 26
};

// Game state/ keyboard handler
let gameScreen = {}
gameScreen.keyListener = window.addEventListener("keydown", function (event) {
  for (var i = 48; i <= 90; i++) {
    if (event.which === i) {
      gameScreen.userInput += String.fromCharCode(i);
    }
  }
});

// sound factory
// function soundFactory(audio, start, stop) {
//     return () => {audio.play();
//       setTimeout(()=>{
//         audio.pause();
//         audio.currentTime = start;
//       }, stop);}
// }

Game._onEachFrame = (() => {
  if (window.RequestAnimationFrame) {
   return (cb) => {
      let _cb = () => { cb(); window.RequestAnimationFrame(_cb)}
      _cb();
    };
  } else {
    return (cb) => {setInterval(cb, 1000 / Game.fps)}
  }
})();

// Game methods
Game.start = () => {
  Game.canvas = document.createElement("canvas"); // Create canvas
  Game.canvas.setAttribute("id", "game");
  Game.canvas.width = Game.width;
  Game.canvas.height = Game.height;

  document.getElementById("game-frame").appendChild(Game.canvas); // Add canvas to game-frame

  Game.ctx = Game.canvas.getContext("2d"); // Get canvas context
  Game.changeState(gameScreen)
  Game._onEachFrame(Game.run);
};

Game.changeState = screen => {
  Game.keyTimeout = Date.now() + 200;
  screen.init();
  Game.draw = screen.draw;
  Game.update = screen.update;
}

Game.run = (() => {
  let loops = 0, skipTicks = 1000 / Game.fps,
      maxFrameSkip = 10,
      nextGameTick = (new Date).getTime(),
      lastGameTick;

  return () => {
    loops = 0;

    while ((new Date).getTime() > nextGameTick) {
      Game.update();
      nextGameTick += skipTicks;
      loops++;
    }

    if (loops) Game.draw();
  }
})();
