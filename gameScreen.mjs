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

import * as draw from './draw.mjs';

const BOARD_FONT = '40px monospace, "Courier New", Courier';
const DISPLAY_FONT = '35px monospace, "Courier New", Courier';
const MARGIN_LEFT = 9;
const BOARD_LENGTH = 10;

let board = new Array(24).fill("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, " ") + "!>");
board.push("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, "=") + "!>");

export class BlankScreen {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
  }
  init() {}
  update() {}
  draw() {}
  updateDom() {}
}

export class GameScreen extends BlankScreen {
  init() {
    this.ctx.font = BOARD_FONT;
    this.ctx.fillStyle = "#0F0";
    this.ctx.lineWidth = 0.1;
    this.ctx.shadowColor = "#080";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 30;
    this.blocks = [];
    let alfred = new draw.Block('t', MARGIN_LEFT+2, 2, 2, 0);
    this.blocks.push(alfred);
    setInterval(function () {
      alfred.move(1, 0);
    }, 1000);
  }
  update() {

  }
  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);
    let piecesBoard = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    draw.placeBlocks(this.blocks, piecesBoard);
    let layers = [piecesBoard, board];
    draw.drawLayers(this.ctx, layers);
  }
}
