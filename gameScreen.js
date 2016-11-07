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

// main game screen
gameScreen.init = () => {
  Game.ctx.font = "30px VT323";
  Game.ctx.fillStyle = "#0F0";
  Game.ctx.lineWidth = 0.1;
  gameScreen.cursor = true;
  gameScreen.userInput = "";
  gameScreen.text = [];
  gameScreen.text.push(...gameText.intro);
  gameScreen.text.push(...gameText.report);
  gameScreen.text.push(...gameText.buyAcres);
  setInterval(() => gameScreen.cursor=!gameScreen.cursor, 500);
}

gameScreen.draw = () => {
  Game.ctx.clearRect(0, 0, Game.width, Game.height)
  let showText = makeText(gameScreen.text, gameScreen.userInput);
  blitScreen(showText, gameScreen.cursor);
}

gameScreen.update = () => {

}
