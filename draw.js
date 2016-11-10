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

let gameText = {
  intro: [
    `                HAMURABI ALMOST FROM SCRATCH`,
    `            A REPRODUCTION OF THIS ANCIENT GAME BY`,
    `              LUIZ EDUARDO AMARAL - 2016 - ${VERSION}`,
    ``,
    ``
  ],
  help: [
    `CONGRATULATIONS, YOU ARE THE NEWEST RULER OF ANCIENT SAMARIA`,
    `ELECTED FOR A TEN YEAR TERM OF OFFICE. YOUR DUTIES ARE TO ,`,
    `DISPENSE FOOD DIRECT FARMING, AND BUY/SELL LAND AS NEEDED TO`,
    `SUPPORT YOUR PEOPLE. WATCH OUT FOR RAT INFESTATIONS AND THE`,
    `PLAGE! GRAIN IS THE GENREAL CURRENCY, MEASURED IN BUSHELS`,
    ` * EACH PERSON NEEDS AT LEAST 20 BUSHELS OF GRAIN PER YEAR`,
    `   TO SURVIVE`,
    ` * EACH PERSON CAN FARM AT MOST 10 ACRES OF LAND`,
    ` * IT TAKES 2 BUSHELS OF GRAIN TO FARM AN ACRE OF LAND`,
    ` * THE MARKET PRICE FOR LAND FLUCTUATES YEARLY`,
    `RULE WISELY AND YOU WILL BE SHOWERED WITH APPRECIATION AT`,
    `THE END OF YOUR TERM. RULE POORLY AND YOU WILL BE KICKED OUT`,
    `OF OFFICE!`,
    ``
  ],
  reset: [
    `TRY YOU HAND AT GOVERNING ANCIENT SUMERIA`,
    `FOR A TEN YEAR TERM OF OFFICE`,
    ``,
    ``
  ],
  buyAcres: [`HOW MANY ACRES DO YOU WISH TO BUY? `],
  sellAcres: [`HOW MANY ACRES DO YOU WISH TO SELL? `],
  feed: [`HOW MANY BUSHELS DO TO FEED YOUR PEOPLE? `],
  plant: [`HOW MANY ACRES DO YOU WISH TO PLANT WITH SEED? `],
  fink: [
    `DUE THIS EXTREME MISMANAGEMENT YOU`,
    `HAVE NOT ONLY BEEN IMPEACHED AND THROWN`,
    `OUT OF OFFICE, BUT YOU HAVE ALSO BEEN DECLARED,`,
    ``,
    `                     'NATIONAL FINK!!!'`,
    `SO LONG FOR NOW.`
  ],
  cantDo: [
    `I CANNOT DO WHAT YOU WISH.`,
    `GET YOURSELF ANOTHER STEWARD!!!!!`,
    ``,
    `SO LONG FOR NOW.`
  ],
  plague: [`A HORRIBLE PLAGUE STRUCK! HALF THE PEOPLE DIED.`],
  bountiful: [`HAMURABI: A BOUNTIFUL HARVEST!`],
  fantastic: [
    `A FANTASTIC PERFORMANCE!!! CHARLEMAGNE, DISRAELI, AND`,
    `JEFFERSON COMBINED COULD NOT HAVE DONE BETTER!`
  ],
  heavy: [
    `YOUR HEAVY-HANDED PERFORMANCE SMACKS OF NERO AND IVAN IV.`,
    `THE PEOPLE (REMAINING) FIND YOU AN UNPLEASANT RULER, AND,`,
    `FRANKLY, HATE YOUR GUTS!!`
  ]
}

function reassignText() {
  gameText.report = [
    `HAMURABI: I BEG TO REPORT TO YOU, IN YEAR ${Game.year},`,
    `${Game.starved} PEOPLE STARVED, ${Game.came} CAME TO THE CITY,`,
    `POPULATION IS NOW ${Game.population}`,
    `THE CITY NOW OWNS ${Game.acres} ACRES.`,
    `YOU HARVESTED ${Game.harvest} BUSHELS PER ACRE`,
    `RATS ATE ${Game.rats} BUSHELS.`,
    `YOU NOW HAVE ${Game.bushels} BUSHELS IN STORE`,
    ``,
    `LAND IS TRADING AT ${Game.trade} BUSHELS PER ACRE`
  ];
  gameText.cantBuy = [
    `HAMURABI: THINK AGAIN. YOU HAVE ONLY`,
    `${Game.bushels} BUSHELS OF GRAIN. NOW THEN,`
  ];
  gameText.cantSell = [
    `HAMURABI: THINK AGAIN. YOU OWN ONLY ${Game.acres} ACRES. NOW THEN,`
  ];
  gameText.cantPlant = [
    `BUT YOU HAVE ONLY ${Game.population} PEOPLE TO TEND THE FIELDS! NOW THEN,`
  ];
  gameText.starved = [`YOU STARVED ${Game.starved} PEOPLE IN ONE YEAR!!!`];
  gameText.endReport = [
    `IN YOUR 10-YEAR TERM OF OFFICE, ${Game.percent} PERCENT OF THE`,
    `POPULATION STARVED PER YEAR ON THE AVERAGE, I.E. A TOTAL OF`,
    `${Game.died} PEOPLE DIED!!`,
    `YOU STARTED WITH 10 ACRES PER PERSON AND ENDED WITH`,
    `${Game.acrePerson} ACRES PER PERSON.`,
    ``
  ]
  gameText.better = [
    `YOUR PERFORMANCE COULD HAVE BEEN SOMEWHAT BETTER, BUT`,
    `${Game.assassin} PEOPLE REALLY LIKE TO SEE YOU ASSASSINATED BUT WE ALL`,
    `HAVE OUR TRIVIAL PROBLEMS.`
  ];
}
reassignText();
