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

// Functions
function blitScreen(textArr, user, cursor) {
  /* Draws a 61 character line at a time until the
  end of the `text` string
  HAS SIDE EFFECT! messes with textArr
  */
  let lineSize = 60;
  let totalLines = 19;
  let carry = 0;
  let printArr = []
  // prepare text
  textArr.slice(0, textArr.length-1).forEach(value => {
    do {
      printArr.push(value.slice(0, lineSize));
      value = value.slice(lineSize, value.length);
      carry++;
    } while (value.length > 0)
  });

  // prepare user input
  let lastLine = textArr.slice(textArr.length-1)[0]+user;
  let cursorX = (lastLine.length % lineSize + 2)*11.7 + 25;
  do {
    printArr.push(lastLine.slice(0, lineSize));
    lastLine = lastLine.slice(lineSize, lastLine.length);
    carry++;
  } while (lastLine.length > 0);

  let idx;
  let slice = (printArr.length-(printArr.length<totalLines? printArr.length: totalLines));
  printArr.slice(slice).forEach((value, index) => {
    Game.ctx.fillText(value, 50, 50+28*index);
    idx = index;
  });
  let cursorY = 50 + 28 * (idx + (printArr[printArr.length-1].length == lineSize ? 1 : 0));

  if (cursor) {
    Game.ctx.fillText("_", cursorX, cursorY);
  }
}
