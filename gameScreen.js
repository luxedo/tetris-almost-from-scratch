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
  Game.ctx.font = "28px VT323";
  Game.ctx.fillStyle = "#0F0";
  Game.ctx.lineWidth = 0.1;
  Game.ctx.shadowColor = "#080";
  Game.ctx.shadowOffsetX = 0;
  Game.ctx.shadowOffsetY = 0;
  Game.ctx.shadowBlur = 30;
  gameScreen.resetGame(gameText.intro.concat(gameText.help));
  Game.state = "over";
  gameScreen.cursor = true
  setInterval(() => gameScreen.cursor=!gameScreen.cursor, 200);
}

gameScreen.draw = () => {
  Game.ctx.clearRect(0, 0, Game.width, Game.height);
  blitScreen(gameScreen.text, gameScreen.userInput, gameScreen.cursor);
}

gameScreen.update = () => {

}

gameScreen.apply = () => {
  let number = gameScreen.getIntegerInput();
  reassignText();

  switch (Game.state) {
    case "buy":
      if (!isNaN(number) || number < 0) {
        if (number*Game.trade > Game.bushels) {
          gameScreen.pushLine(gameText.cantBuy.concat(gameText.buyAcres), 100);
        } else if (number === 0) {
          gameScreen.saveLastLine();
          gameScreen.pushLine(gameText.sellAcres, 100);
          Game.state = "sell";
        } else {
          gameScreen.saveLastLine();
          gameScreen.pushLine(gameText.feed, 100);
          Game.acres += number;
          Game.bushels -= Game.trade*number;
          Game.state = "feed";
        }
      } else {
        gameScreen.pushLine(gameText.cantDo);
        Game.state = "over";
      }
      gameScreen.userInput = "";
      break;

    case "sell":
      if (!isNaN(number) || number < 0) {
        if (number > Game.acres) {
          gameScreen.pushLine(gameText.cantSell
            .concat(gameText.sellAcres))
        } else {
          gameScreen.saveLastLine();
          gameScreen.pushLine([``].concat(gameText.feed), 100)
          Game.acres -= number;
          Game.bushels += Game.trade*number;
          Game.state = "feed";
        }
      } else {
        gameScreen.pushLine(gameText.cantDo, 100);
        Game.state = "over";
      }
      gameScreen.userInput = "";
      break;

    case "feed":
      if (!isNaN(number) || number < 0) {
        if (number > Game.bushels) {
          gameScreen.pushLine(gameText.cantBuy
            .concat(gameText.feed), 100)
        } else {
          gameScreen.saveLastLine();
          gameScreen.pushLine(gameText.plant, 100)
          Game.bushels -= number;
          Game.feed = number;
          Game.state = "plant";
        }
      } else {
        gameScreen.pushLine(gameText.cantDo, 100);
        Game.state = "over";
      }
      gameScreen.userInput = "";
      break;

    case "plant":
      if (!isNaN(number) || number < 0) {
        if (number > Game.population*10) {
          gameScreen.pushLine(gameText.cantPlant
            .concat(gameText.plant), 100);
        } else if (2*number > Game.bushels) {
          gameScreen.pushLine(gameText.cantBuy
            .concat(gameText.plant), 100);
        } else if (number > Game.acres) {
          gameScreen.pushLine(gameText.cantSell
            .concat(gameText.plant), 100);
        } else {
          gameScreen.saveLastLine();
          gameScreen.pushLine([``], 100);
          Game.planted = number;
          Game.bushels -= 2*number;
          Game.state = "buy";
          gameScreen.endTurn();
        }
      } else {
        gameScreen.pushLine(gameText.cantDo, 100);
        Game.state = "over";
      }
      gameScreen.userInput = "";
      break
    case "over":
      gameScreen.resetGame(gameText.intro
        .concat(gameText.reset)
        .concat(gameText.report)
        .concat(gameText.buyAcres));
      break;
  }
}

gameScreen.pushLine = (lines, timeout) => {
  lines.forEach((line, index) => {
    setTimeout(() => {
      gameScreen.text.push(``);
      for (let i=0; i < line.length; i++) {
        let index = gameScreen.text.length-1;
        setTimeout(() => {
          gameScreen.text[index] += line[i];
        }, i);
      }
    }, timeout+index*60)
  });
}

gameScreen.saveLastLine = () => {
  gameScreen.text[gameScreen.text.length-1] += gameScreen.userInput;
}

gameScreen.endTurn = () => {
  // assign
  Game.year++;
  Game.trade = gameScreen.randInt(17, 26);
  Game.came = gameScreen.randInt(1, 5);
  Game.harvest = gameScreen.randInt(1, 10);
  Game.starved = (Game.population*20 - Game.feed)/20;
  Game.rats = (Math.random()<0.1?gameScreen.randInt(0, 4)*50:0);
  Game.totalPop += Game.came;
  let plague = Math.random()<0.15;

  // update
  if (plague) {
      Game.population /= 2;
      Game.population += Game.came;
      gameScreen.pushLine(gameText.plague, 0);
    } else {
      Game.population += Game.came-Game.starved;
    }
    Game.bushels += Game.harvest*Game.planted-Game.rats

  // end game
  if (Game.starved/Game.population > 0.45) {
    reassignText();
    gameScreen.pushLine(gameText.starved
      .concat(gameText.fink), 100);
    Game.state = "over";
  } else if (Game.year >= 3) {
    Game.percent = (Game.totalPop-Game.population)/(Game.year-1);
    Game.died = Math.round(Game.percent/100*Game.totalPop);
    Game.acrePerson = Game.acres/Game.population;
    Game.assassin = gameScreen.randInt(0, Game.population*0.8)

    reassignText();
    if (Game.percent > 33 || Game.acrePerson < 7) {
      gameScreen.pushLine(gameText.endReport
        .concat(gameText.fink), 500);
    } else if (Game.percent > 10 || Game.acrePerson < 9) {
      gameScreen.pushLine(gameText.endReport
        .concat(gameText.heavy), 500);
    } else if (Game.percent > 3 || Game.acrePerson < 10) {
      gameScreen.pushLine(gameText.endReport
        .concat(gameText.better), 500);
    } else {
      gameScreen.pushLine(gameText.endReport
        .concat(gameText.fantastic), 500);
    }
    Game.state = "over";
  } else {
    reassignText();
    gameScreen.pushLine(gameText.report
      .concat(gameText.buyAcres), 100);
  }
}

gameScreen.randInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

gameScreen.resetGame = (text) => {
  Game.year = 1;
  Game.starved = 0;
  Game.came = 5;
  Game.population = 100;
  Game.acres = 1000;
  Game.planted = 1000;
  Game.harvest = 3;
  Game.rats = 200;
  Game.bushels = 2800;
  Game.trade = 26;
  Game.feed = 0;
  Game.state = "buy";
  Game.totalPop = 100;
  reassignText();
  gameScreen.userInput = "";
  gameScreen.text = [``];
  gameScreen.pushLine(text, 1000);
}

gameScreen.getIntegerInput = () => {
  return (Math.round(gameScreen.userInput) == gameScreen.userInput? Math.round(gameScreen.userInput): NaN );
}
