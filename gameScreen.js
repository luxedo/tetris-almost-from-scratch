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
"use strict";

// main game screen
gameScreen.init = () => {
  Game.ctx.font = "28px VT323";
  Game.ctx.fillStyle = "#0F0";
  Game.ctx.lineWidth = 0.1;
  Game.ctx.shadowColor = "#080";
  Game.ctx.shadowOffsetX = 0;
  Game.ctx.shadowOffsetY = 0;
  Game.ctx.shadowBlur = 30;
  // gameScreen.pushLine(gameText.intro.concat(gameText.help), 1000);
  // Game.state = "over";
  // gameScreen.cursor = true
  setInterval(() => gameScreen.cursor=!gameScreen.cursor, 200);
}

gameScreen.draw = () => {
  Game.ctx.clearRect(0, 0, Game.width, Game.height);
  // blitScreen(gameScreen.text, gameScreen.userInput, gameScreen.cursor);
}

gameScreen.update = () => {

}
