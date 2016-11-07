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
function blipScreen(text) {
  /* Draws a 40 character line at a time until the
  end of the `text` string*/

  let textArr = text.split("\n");
  let carry = 0;
  textArr.forEach(value => {
    do {
      Game.ctx.fillText(value, 20, 50+35*carry);
      value = value.slice(39);
      carry += 1;
    }
    while (value.length > 0);
  });
}
