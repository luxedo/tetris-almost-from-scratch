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

const FONT_FAMILY = '"Lucida Sans Typewriter", "Lucida Console", monospace';
const BOARD_FONT_SIZE = 45;
const DISPLAY_FONT_SIZE = 24;
const TITLE_FONT_SIZE = 45;
const CREDITS_FONT_SIZE = 16;
const BOARD_FONT = `${BOARD_FONT_SIZE}px ${FONT_FAMILY}`;
const DISPLAY_FONT = `${DISPLAY_FONT_SIZE}px ${FONT_FAMILY}`;
const TITLE_FONT = `${TITLE_FONT_SIZE}px ${FONT_FAMILY}`;
const CREDITS_FONT = `${CREDITS_FONT_SIZE}px ${FONT_FAMILY}`;
const MARGIN_LEFT = 8;
const BOARD_LENGTH = 10;
const BOARD_HEIGHT = 24;

let board = new Array(BOARD_HEIGHT).fill("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, " ") + "!>");
board.push("<!".padStart(MARGIN_LEFT + 2, " ") + "".padStart(BOARD_LENGTH, "=") + "!>");

export class BlankScreen {
  constructor(game) {
    this.game = game;
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.keys = game.keys;
  }
  init() {}
  update() {}
  draw() {}
  updateDom() {}
}

export class BackgroundScreen extends BlankScreen {
  init() {
    this.fillStyle = "#0F0";
    this.shadowColor = "#080";
    this.fillStyleFg = "#060";
    this.shadowColorFg = "#030";
    this.fillStyleBg = "#020";
    this.shadowColorBg = "#020";

    this.borderBlocks = [];
    for (let i = 0; i < 30; i += 5) {
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), i, 0, 0, Math.floor(Math.random() * 4)));
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), i, 22, 0, Math.floor(Math.random() * 4)));
    }
    for (let i = 5; i < 20; i += 6) {
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), 0, i, 0, Math.floor(Math.random() * 4)));
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), 25, i, 0, Math.floor(Math.random() * 4)));
    }
    this.bgBlocks = makeBg();
  }
  update() {
    randomizeBlocks(this.borderBlocks, 0.05, 0.05);
    randomizeBlocks(this.bgBlocks, 0.05, 0.05);
  }
  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    this.ctx.font = BOARD_FONT;
    this.bgMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks(this.bgBlocks, this.bgMatrix);
    draw.drawLayers(this.ctx, [this.bgMatrix], this.fillStyleBg, this.shadowColorBg);

    this.textMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks(this.borderBlocks, this.textMatrix);
    draw.drawLayers(this.ctx, [this.textMatrix], this.fillStyleFg, this.shadowColorFg);

    this.ctx.fillStyle = this.fillStyle;
    this.ctx.shadowColor = this.shadowColor;
  }
}

export class GameScreen extends BlankScreen {
  init() {
    this.ctx.font = BOARD_FONT;
    this.ctx.lineWidth = 0.1;
    this.fillStyle = "#0F0";
    this.shadowColor = "#080";
    this.keyInterval = 100;
    this.dropInterval = 20;
    this.level = 0;
    this.score = 0;
    this.totalBrokenLines = 0;
    this.scoreBase = [0, 40, 100, 300, 1200];
    this.collided = 0;
    this.setNetxMove();
    this.currentBlocks = [];
    this.nextPiece = new draw.Block(draw.randomBlockType(), 24, 4, 0, 0);
    this.spawnTetrominoes();
    this.frozenBlocks = [];
  }
  setNetxMove() {
    this._nextMove = Date.now() + 1000 * Math.pow(0.8, this.level);
  }
  nextMove() {
    if (Date.now() >= this._nextMove) {
      this.setNetxMove();
      return true;
    }
    return false;
  }
  update() {
    // Move the block down
    if (this.nextMove()) {
      this.currentBlocks.map(block => block.move(1, 0));
      this.checkCollisions("down");
    }
    this.checkUserInput();
    // Spawn pieces if a bottom collision has occoured
    if (this.collided > 0) {
      this.spawnTetrominoes();
      this.collided = 0;

      // Check for line breaks
      this.breakFullLines();
      if (this.totalBrokenLines >= (this.level + 1) * 10) this.level++;

      this.checkCollisions("down");

      // Game over
      if (this.checkGameOver()) {
        this.game.changeScreen(new GameOverScreen(this.game, this.level, this.score));
      }
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    // Draw Blocks and board
    let cBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    let fBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    draw.placeBlocks(this.currentBlocks, cBlocks);
    draw.placeBlocks(this.frozenBlocks, fBlocks);
    let layers = [cBlocks, fBlocks, board];
    this.ctx.font = BOARD_FONT;
    draw.drawLayers(this.ctx, layers, this.fillStyle, this.shadowColor);

    // Draw Next Piece
    let nextPieceMatrix = new Array(25).fill(" ".repeat(25));
    draw.placeBlocks([this.nextPiece], nextPieceMatrix);
    draw.drawLayers(this.ctx, [nextPieceMatrix]);

    // Draw score
    this.ctx.font = DISPLAY_FONT;
    const display = [
      "Tetris                                    +=========+",
      "Almost From                               |следующий|",
      "Scratch                                   |         |",
      "                                          |         |",
      `УРОВЕНЬ: ${this.level.toString().padEnd(33, " ")}|         |`,
      `СЧЕТ: ${this.score.toString().padStart(4, " ").padEnd(36, " ")}+=========+`
    ];
    display.forEach((row, idx) => {
      this.ctx.fillText(row, 20, idx * 30 + 45);
    });
  }
  checkUserInput() {
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
              } else if (!freeze.includes(index) && move === "down") {
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
  spawnTetrominoes() {
    let row = 0;
    let col = 6;
    if (this.nextPiece.type === "o") col++;
    if (this.nextPiece.type === "j" || this.nextPiece.type === "l") row--;
    this.currentBlocks.push(new draw.Block(this.nextPiece.type, MARGIN_LEFT - 1, row, col, 0));
    this.nextPiece = new draw.Block(draw.randomBlockType(), 24, 4, 0, 0);
    if (this.nextPiece.type == "i") this.nextPiece.move(0, -1);
    if (["j", "l", "i"].includes(this.nextPiece.type)) this.nextPiece.move(-1, 0);
  }
  breakFullLines() {
    const blockCoord = this.frozenBlocks
      .map(block => block.coordinates)
      .flat()
      .reduce((acc, coord) => {
        const row = coord[0].toString();
        const col = coord[1];
        if (!(row.toString() in acc)) {
          acc[row] = [col - 3];
        } else {
          acc[row].push(col - 3);
        }
        return acc;
      }, {});
    let brokenLines = 0;
    for (let row in blockCoord) {
      if (blockCoord[row].length == 10) {
        brokenLines++;
        this.breakLine(parseInt(row));
      }
    }
    brokenLines = brokenLines > 4 ? 4 : brokenLines;
    this.score += this.scoreBase[brokenLines] * (this.level + 1);
    this.totalBrokenLines += brokenLines;
  }
  breakLine(row) {
    this.frozenBlocks = this.frozenBlocks
      .filter(block => block.row !== row)
      .map(block => {
        if (block.row < row) block.row++;
        return block;
      });
  }
  checkGameOver() {
    return Math.min(...this.frozenBlocks.map(block => block.topmost)) <= 0;
  }
}

export class GameOverScreen extends BackgroundScreen {
  constructor(game, level, score) {
    super(game);
    this.score = score;
    this.level = level;
  }
  init() {
    super.init();
    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.position = 0;
    this.cursorPositions = [
      [13 - this.cursor.bottommost, 4 - this.cursor.rightmost], // PLAY AGAIN
      [16 - this.cursor.bottommost, 3 - this.cursor.rightmost], // MENU
      [19 - this.cursor.bottommost, 5 - this.cursor.rightmost], // HIGH SCORES
    ];
    this.keyInterval = 200;
    this.update();
  }
  update() {
    super.update();
    if (this.keys.isActive("down") || this.keys.isHolding("down", this.keyInterval)) {
      this.position++;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("up") || this.keys.isHolding("up", this.keyInterval)) {
      this.position += this.cursorPositions.length - 1;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("confirm") || this.keys.isActive("hardDrop") || this.keys.isActive("sRight") || this.keys.isActive("sLeft")) {
      switch (this.position) {
        case 0:
          this.game.changeScreen(new GameScreen(this.game));
          break;
        case 1:
          this.game.changeScreen(new HighScoreScreen(this.game));
          break;
        case 2:
          this.game.changeScreen(new MenuScreen(this.game));
          break;
      }
    }
    this.cursor.row = this.cursorPositions[this.position][0];
    this.cursor.col = this.cursorPositions[this.position][1];
  }
  draw() {
    // this.ctx.clearRect(0, 0, this.game.width, this.game.height);
    super.draw();

    this.ctx.fillStyle = this.fillStyle;
    this.ctx.shadowColor = this.shadowColor;

    this.ctx.font = TITLE_FONT;
    this.ctx.textAlign = "center";
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, 200);
    this.ctx.font = DISPLAY_FONT;
    this.ctx.fillText('PLAY AGAIN', this.canvas.width / 2, 310);
    this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 375);
    this.ctx.fillText('MENU', this.canvas.width / 2, 440);
    this.ctx.textAlign = "start";

    this.ctx.font = BOARD_FONT;
    this.cursorMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks([this.cursor], this.cursorMatrix);
    draw.drawLayers(this.ctx, [this.cursorMatrix], this.fillStyle, this.shadowColor);
  }
}

export class MenuScreen extends BackgroundScreen {
  init() {
    super.init();
    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.position = 0;
    this.cursorPositions = [
      [13 - this.cursor.bottommost, 4 - this.cursor.rightmost], // PLAY AGAIN
      [16 - this.cursor.bottommost, 3 - this.cursor.rightmost], // MENU
      [19 - this.cursor.bottommost, 5 - this.cursor.rightmost], // HIGH SCORES
    ];
    this.keyInterval = 200;
    this.update();
  }
  update() {
    super.update();
    if (this.keys.isActive("down") || this.keys.isHolding("down", this.keyInterval)) {
      this.position++;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("up") || this.keys.isHolding("up", this.keyInterval)) {
      this.position += this.cursorPositions.length - 1;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("confirm") || this.keys.isActive("hardDrop") || this.keys.isActive("sRight") || this.keys.isActive("sLeft")) {
      switch (this.position) {
        case 0:
          this.game.changeScreen(new GameScreen(this.game));
          break;
        case 1:
          this.game.changeScreen(new HighScoreScreen(this.game));
          break;
        case 2:
          this.game.changeScreen(new CreditsScreen(this.game));
          break;
      }
    }
    this.cursor.row = this.cursorPositions[this.position][0];
    this.cursor.col = this.cursorPositions[this.position][1];
  }
  draw() {
    // this.ctx.clearRect(0, 0, this.game.width, this.game.height);
    super.draw();

    this.cursorMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks([this.cursor], this.cursorMatrix);
    draw.drawLayers(this.ctx, [this.cursorMatrix], this.fillStyle, this.shadowColor);

    this.ctx.font = TITLE_FONT;
    this.ctx.textAlign = "center";
    this.ctx.fillText('Tetris', this.canvas.width / 2, 150);
    this.ctx.fillText('Almost From Scratch', this.canvas.width / 2, 195);
    this.ctx.font = DISPLAY_FONT;
    this.ctx.fillText('PLAY', this.canvas.width / 2, 310);
    this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 375);
    this.ctx.fillText('CREDITS', this.canvas.width / 2, 440);
    this.ctx.font = CREDITS_FONT;
    this.ctx.fillText('v1.0', this.canvas.width / 2, 500);
    this.ctx.textAlign = "start";
  }
}

export class HighScoreScreen extends BlankScreen {
  init() {
    const URI = "https://firestore.googleapis.com/v1beta1/projects/tetris-almost-from-scratch/databases/(default)/documents/scores?pageSize=10&orderBy=score%20desc";
    fetch(URI).then((response) => {
      if (!response.ok) {
        throw new Error('HTTP error, status = ' + response.status);
      }
      return response.blob();
    });
  }
  update() {

  }
  draw() {

  }
}

export class CreditsScreen extends BackgroundScreen {
  init() {
    super.init();
    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.cursor.row = 23 - this.cursor.bottommost;
    this.cursor.col = 5 - this.cursor.rightmost;
  }
  update() {
    super.update();
    if (this.keys.isActive("confirm") || this.keys.isActive("hardDrop") || this.keys.isActive("sRight") || this.keys.isActive("sLeft")) {
      this.game.changeScreen(new MenuScreen(this.game));
    }
  }
  draw() {
    // this.ctx.clearRect(0, 0, this.game.width, this.game.height);
    super.draw();

    this.ctx.font = BOARD_FONT;
    this.cursorMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks([this.cursor], this.cursorMatrix);
    draw.drawLayers(this.ctx, [this.cursorMatrix], this.fillStyle, this.shadowColor);

    this.ctx.fillStyle = this.fillStyle;
    this.ctx.shadowColor = this.shadowColor;

    this.ctx.font = TITLE_FONT;
    this.ctx.textAlign = "center";
    // this.ctx.fillText('TETRIS ALMOST FROM SCRATCH', this.canvas.width/2, 100);
    this.ctx.fillText('Tetris', this.canvas.width / 2, 150);
    this.ctx.fillText('Almost From Scratch', this.canvas.width / 2, 195);

    this.ctx.font = DISPLAY_FONT;
    this.ctx.fillText('BACK', this.canvas.width / 2, 510);

    this.ctx.font = CREDITS_FONT;
    this.ctx.textAlign = "start";
    const text = [
      "This is an attempt of making the game tetris with modern",
      "programming languages. You can find more information about",
      "the project in it's github page:",
      "https://github.com/luxedo/asteroids-almost-from-scratch",
      "",
      "Thanks to the playtesters: ...",
      "",
      "",
      "",
      "",
      "",
    ];
    const textCopyright = ["This project is under a GNU GPL3 license. Have fun!",
      "Copyright (C) 2019  Luiz Eduardo Amaral",
      "<luizamaral306(at)gmail.com>"
    ];

    text.forEach((row, idx) => {
      this.ctx.fillText(row, 130, 250 + idx * (CREDITS_FONT_SIZE));
    });

    this.ctx.textAlign = "center";
    textCopyright.forEach((row, idx) => {
      this.ctx.fillText(row, this.canvas.width / 2, 430 + idx * (CREDITS_FONT_SIZE));
    });
    this.ctx.textAlign = "start";
  }
}

const makeBg = () => {
  let bgBlocks = [];
  for (let i = 0; i < 30; i += 5) {
    for (let j = 0; j < 25; j += 5) {
      bgBlocks.push(new draw.Block(draw.randomBlockType(), i, j, 0, Math.floor(Math.random() * 4)));
    }
  }
  return bgBlocks;
};

const randomizeBlocks = (blocks, chanceRot, chanceChange) => {
  blocks.forEach(block => {
    const type = Math.random() < chanceChange ? draw.randomBlockType() : block.type;
    block.type = type;
    const rot = Math.random() < chanceRot ? 1 : 0;
    block.rotate(rot);
  });
};
