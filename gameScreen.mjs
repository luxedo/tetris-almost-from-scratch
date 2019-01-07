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
import * as draw from './draw.mjs';

const BOARD_FONT = '40px monospace, "Courier New", Courier';
const DISPLAY_FONT = '35px monospace, "Courier New", Courier';
const MARGIN_LEFT = 9;
const BOARD_LENGTH = 10;
const BOARD_HEIGHT = 24;

let board = new Array(BOARD_HEIGHT).fill("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, " ") + "!>");
board.push("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, "=") + "!>");

export class BlankScreen {
  constructor(game) {
    this.game = game;
    this.ctx = game.ctx;
    this.keys = game.keys;
  }
  init() {}
  update() {}
  draw() {}
  updateDom() {}
}

export class GameScreen extends BlankScreen {
  init() {
    this.ctx.font = BOARD_FONT;
    this.ctx.lineWidth = 0.1;
    this.fillStyle = "#0F0";
    this.shadowColor = "#080";
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.shadowBlur = 30;
    this.keyInterval = 100;
    this.dropInterval = 20;
    this.speed = 1;
    this.collided = 0;
    this.setNetxMove();
    this.currentBlocks = [
      // new draw.Block('l', MARGIN_LEFT-1, 0, 10, 0),
      // new draw.Block('j', MARGIN_LEFT-1, 4, 11, 0),
      // new draw.Block('i', MARGIN_LEFT-1, 20, 11, 0),
      // new draw.Block('o', MARGIN_LEFT-1, 13, 11, 0),
      // new draw.Block('t', MARGIN_LEFT-1, 22, 6, 0),
      // new draw.Block('s', MARGIN_LEFT-1, 22, 3, 0),
      // new draw.Block('z', MARGIN_LEFT-1, 22, 10, 0),
    ];
    this.spawnTetrominoes();
    this.frozenBlocks = [];
  }
  setNetxMove() {
    this._nextMove = Date.now() + 1000 * Math.pow(0.8, this.speed);
  }
  nextMove() {
    if (Date.now() >= this._nextMove) {
      this.setNetxMove();
      return true;
    }
    return false;
  }
  update() {
    if (this.nextMove()) {
      this.currentBlocks.map(block => block.move(1, 0));
      this.checkCollisions("down");
    }
    if (this.keys.isActive("left") || this.keys.isHolding("left", this.keyInterval)) {
      this.currentBlocks.map(block => block.move(0, -1));
      this.checkCollisions("left");
    }
    if (this.keys.isActive("right") || this.keys.isHolding("right", this.keyInterval)) {
      this.currentBlocks.map(block => block.move(0, 1));
      this.checkCollisions("right");
    }
    if (this.keys.isActive("hardDrop")) {
      while (!this.checkCollisions("down")) {
        this.currentBlocks.map(block => block.move(1, 0));
      }
    }
    if (this.keys.isHolding("drop", this.dropInterval)) {
      this.currentBlocks.map(block => block.move(1, 0));
      this.checkCollisions("down");
    }
    if (this.keys.isActive("sLeft")) {
      this.currentBlocks.map(block => block.rotate(1));
      this.checkCollisions("sLeft");
    }
    if (this.keys.isActive("sRight")) {
      this.currentBlocks.map(block => block.rotate(-1));
      this.checkCollisions("sRight");
    }
    // Spawn pieces if a bottom collision has occoured
    if (this.collided > 0) {
      this.spawnTetrominoes();
      this.collided = 0;
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);
    let cBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    let fBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    draw.placeBlocks(this.currentBlocks, cBlocks);
    draw.placeBlocks(this.frozenBlocks, fBlocks);
    let layers = [cBlocks, fBlocks, board];
    draw.drawLayers(this.ctx, layers, this.fillStyle, this.shadowColor);
  }
  checkCollisions(move) {
    let freeze = [];
    this.currentBlocks.map((block, index) => {
      // Other blocks collision
      this.frozenBlocks
        .map(fBlock => {
          const coordF = fBlock.coordinates[0];
          const coords = block.coordinates;
          for (let i = 0; i < coords.length; i++) {
            const coord = coords[i];
            if (coord[0] == coordF[0] && coord[1] == coordF[1]) {
              if (move == "left") {
                block.move(0, 1);
              } else if (move == "right") {
                block.move(0, -1);
              } else if (move == "sLeft") {
                block.rotate(-1);
              } else if (move == "sRight") {
                block.rotate(1);
              }
              else if (!freeze.includes(index) && move === "down") {
                block.move(-1, 0);
                freeze.push(index);
                this.collided += 1;
              }
              break;
            }
          }
        });
      // Left wall collision
      if (block.leftmost <= 2) { // The <= 2 corresponds to the characters "<|"
        block.move(0, 3 - block.leftmost);
      }
      // Right wall collision
      if (block.rightmost > BOARD_LENGTH + 3) { // The 3 corresponds to the characters "<|"
        block.move(0, BOARD_LENGTH + 3 - block.rightmost);
      }
      // Bottom collision
      if (block.bottommost >= BOARD_HEIGHT + 1) {
        freeze.push(index);
        block.move(-1, 0);
        this.collided += 1;
      }
    });
    // Freeze blocks that collided
    freeze.sort().reverse().forEach(index => {
      const block = this.currentBlocks.splice(index, 1)[0];
      this.frozenBlocks.push(...block.coordinates
        .map(coords => new draw.Block(".", MARGIN_LEFT - 1, coords[0], coords[1], 0)));
    });

    return freeze.length > 0;
  }
  spawnTetrominoes(type) {
    const blockNames = Object.keys(draw.blockTypes);
    const totalBlocks = blockNames.length;
    let blockType;
    do {
      blockType = blockNames[Math.floor(Math.random() * totalBlocks)];
    }
    while (blockType === ".");
    type = type || blockType;

    let row = 0;
    let col = 6;
    if (type === "o") col++;
    if (type === "j" || type === "l") row--;
    this.currentBlocks.push(new draw.Block(type, MARGIN_LEFT - 1, row, col, 0));
  }
}
