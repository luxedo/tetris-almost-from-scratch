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
  end of the `text` string*/

  // let [textArr, cursor] = makeText(text, user)
  let carry = 0;
  let lastLine;
  textArr.forEach(value => {
    Game.ctx.fillText(value, 20, 50+25*carry);
    lastLine = value;
    carry++;
  });
  if (cursor) {
    Game.ctx.fillText("_", (lastLine.length+2)*12.5-5, 50+25*(carry-1));
  }
}

function makeText(text, user) {
  console.log(text);
  text.push(user);
  return text
  // do {
  //   lastLine = value;
  //   Game.ctx.fillText(value.slice(0, 60), 20, 50+25*carry);
  //   value = value.slice(61);
  //   carry += 1;
  // }
  // while (value.length > 0);
}

let gameText = {
  intro: [
    `                HAMURABI ALMOST FROM SCRATCH`,
    `            A REPRODUCTION OF THIS ANCIENT GAME BY`,
    `              LUIZ EDUARDO AMARAL - 2016 - ${VERSION}`,
    ``,
    ``,
    `TRY YOU HAND AT GOVERNING ANCIENT SUMERIA`,
    `FOR A TEN YEAR TERM OF OFFICE`,
    ``,
    ``
  ],
  report: [
    `HAMURABI: I BEG TO REPORT TO YOU, IN YEAR ${Game.year},`,
    `${Game.starved} PEOPLE STARVED, ${Game.came} CAME TO THE CITY,`,
    `POPULATION IS NOW ${Game.population}`,
    `THE CITY NOW OWNS ${Game.acres} ACRES.`,
    `YOU HARVESTED ${Game.harvest} BUSHELS PER ACRE`,
    `RATS ATE ${Game.rats} BUSHELS.`,
    `YOU NOW HAVE ${Game.store} BUSHELS IN STORE`,
    ``,
    `LAND IS TRADING AT ${Game.trade} BUSHELS PER ACRE`
  ],
  buyAcres: [`HOW MANY ACRES DO YOU WISH TO BUY? `],
  sellAcres: [`HOW MANY ACRES DO YOU WISH TO SELL?`, ``],
  feed: [`HOW MANY BUSHELS DO TO FEED YOUR PEOPLE?`],
  plant: [`HOW MANY ACRES DO YOU WISH TO PLANT WITH SEED?`],
  fink: [
    `DUE THIS EXTREME MISMANAGEMENT YOU`,
    `HAVE NOT ONLY BEEN IMPEACHED AND THROWN`,
    `OUT OF OFFICE, BUT YOU HAVE ALSO BEEN DECLARED,`,
    ``,
    `                     'NATIONAL FINK!!!'`,
    `SO LONG FOR NOW.`
  ]
}
