/*
tetris-almost-from-scratch
This is an attempt of making the game tetris using modern programming languages

Copyright (C) 2019  Luiz Eduardo Amaral - <luizamaral306@gmail.com>

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

export const alphabeth = {
  a: "a", b: "b", c: "c", d: "d", e: "e", f: "f", g: "g", h: "h", i: "i",
  j: "j", k: "k", l: "l", m: "m", n: "n", o: "o", p: "p", q: "q", r: "r",
  s: "s", t: "t", u: "u", v: "v", y: "y", x: "x", w: "w", z: "z"
};

const FONT_FAMILY = '"Lucida Sans Typewriter", "Lucida Console", monospace';
const BOARD_FONT_SIZE = 42.2;
const PIECES_FONT_SIZE = 45;
const DISPLAY_FONT_SIZE = 24;
const HSCORES_FONT_SIZE = 20;
const TITLE_FONT_SIZE = 45;
const SMALL_FONT_SIZE = 16;
const SCORE_FONT_SIZE = 90;
const BOARD_FONT = `${BOARD_FONT_SIZE}px ${FONT_FAMILY}`;
const PIECES_FONT = `${PIECES_FONT_SIZE}px ${FONT_FAMILY}`;
const DISPLAY_FONT = `${DISPLAY_FONT_SIZE}px ${FONT_FAMILY}`;
const HSCORES_FONT = `${HSCORES_FONT_SIZE}px ${FONT_FAMILY}`;
const TITLE_FONT = `${TITLE_FONT_SIZE}px ${FONT_FAMILY}`;
const SMALL_FONT = `${SMALL_FONT_SIZE}px ${FONT_FAMILY}`;
const SCORE_FONT = `${SCORE_FONT_SIZE}px ${FONT_FAMILY}`;
const MARGIN_LEFT = 9;
const MARGIN_LEFT_PIECES = 8;
const BOARD_LENGTH = 10;
const BOARD_HEIGHT = 23;
const COLLECTION = "scores";

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
    for (let i = 1; i < 30; i += 5) {
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), i, 0, 0, Math.floor(Math.random() * 4)));
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), i, 20, 0, Math.floor(Math.random() * 4)));
    }
    for (let i = 5; i < 20; i += 5) {
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), 1, i, 0, Math.floor(Math.random() * 4)));
      this.borderBlocks.push(new draw.Block(draw.randomBlockType(), 25, i, 0, Math.floor(Math.random() * 4)));
    }
    this.bgBlocks = this.makeBg();
  }
  update() {
    this.randomizeBlocks(this.borderBlocks, 0.05, 0.05);
    this.randomizeBlocks(this.bgBlocks, 0.05, 0.05);
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
  makeBg() {
    let bgBlocks = [];
    for (let i = 1; i < 31; i += 5) {
      for (let j = 0; j < 25; j += 5) {
        bgBlocks.push(new draw.Block(draw.randomBlockType(), i, j, 0, Math.floor(Math.random() * 4)));
      }
    }
    return bgBlocks;
  }
  randomizeBlocks(blocks, chanceRot, chanceChange) {
    blocks.forEach(block => {
      const type = Math.random() < chanceChange ? draw.randomBlockType() : block.type;
      block.type = type;
      const rot = Math.random() < chanceRot ? 1 : 0;
      block.rotate(rot);
    });
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
    this.nextPiece = new draw.Block(draw.randomBlockType(), 30, 4, 0, 0);
    this.spawnTetrominoes();
    this.frozenBlocks = [];
    this.pause = false;
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
    if (this.keys.isActive("pause") || this.keys.isActive("pause2")) {
      this.pause = !this.pause;
    }
    if (this.pause) {
      return;
    }
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
        this.game.sounds.play("gameover");
        this.update = () => {};
        setTimeout(() => {
          this.game.changeScreen(new GameOverScreen(this.game, this.level, this.score));
        }, 1200);
      }
    }

    if (this.game.sounds.isPlaying("theme")) {
      this.game.sounds.stop("theme");
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.game.width, this.game.height);

    // Draw Blocks and board
    let cBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    let fBlocks = board.slice(0, board.length).map(row => row.replace(/./g, " "));
    draw.placeBlocks(this.currentBlocks, cBlocks);
    draw.placeBlocks(this.frozenBlocks, fBlocks);
    let layers = [cBlocks, fBlocks];
    this.ctx.font = PIECES_FONT;
    draw.drawLayers(this.ctx, layers, this.fillStyle, this.shadowColor);
    this.ctx.font = BOARD_FONT;
    draw.drawLayers(this.ctx, [board], this.fillStyle, this.shadowColor);

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

    if (this.pause) {
      this.ctx.font = SCORE_FONT;
      this.ctx.fillText("ПАУЗА", 290, 280);
      this.ctx.fillText("=====", 290, 330);
    }
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
      this.game.sounds.play("blip");
      this.currentBlocks.map(block => block.rotate(1));
      this.checkCollisions("sLeft");
    }
    if (this.keys.isActive("sRight") || this.keys.isActive("sRight2")) {
      this.game.sounds.play("blip");
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
                this.game.sounds.play("hit");
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
        this.game.sounds.play("hit");
        freeze.push(index);
        block.move(-1, 0);
        this.collided += 1;
      }
    });
    // Freeze blocks that collided
    freeze.sort().reverse().forEach(index => {
      const block = this.currentBlocks.splice(index, 1)[0];
      this.frozenBlocks.push(...block.coordinates
        .map(coords => new draw.Block(".", MARGIN_LEFT_PIECES - 1, coords[0], coords[1], 0)));
    });

    return freeze.length > 0;
  }
  spawnTetrominoes() {
    let row = 0;
    let col = 6;
    if (this.nextPiece.type === "o") col++;
    if (this.nextPiece.type === "j" || this.nextPiece.type === "l") row--;
    this.currentBlocks.push(new draw.Block(this.nextPiece.type, MARGIN_LEFT_PIECES - 1, row, col, 0));
    this.nextPiece = new draw.Block(draw.randomBlockType(), 30, 4, 0, 0);
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
    for (let i=0; i<brokenLines; i++) {
      setTimeout(() => {
        this.game.sounds.play("break");
      }, 0+50*i);
    }
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
    this.typingCursorPos = 0;
    this.blinkTypingCursor = false;
    this.typingCursorInterval = setInterval(() => {
      this.blinkTypingCursor = !this.blinkTypingCursor;
    }, 500);
    this.position = 0;
    this.cursorPositions = [
      [15 - this.cursor.bottommost, 6 - this.cursor.rightmost], // SUBMIT
      [17 - this.cursor.bottommost, 5 - this.cursor.rightmost], // PLAY AGAIN
      [19 - this.cursor.bottommost, 4 - this.cursor.rightmost], // MENU
      [21 - this.cursor.bottommost, 6 - this.cursor.rightmost], // HIGH SCORES
    ];
    this.keyInterval = 200;
    this.update();
    this.name = "";
    this.maxNameLength = 12;
  }
  update() {
    super.update();
    if (this.keys.isActive("down") || this.keys.isHolding("down", this.keyInterval)) {
      this.game.sounds.play("blip");
      this.position++;
      this.position %= this.cursorPositions.length;
      if (!!this.sent && this.position==0) {
        this.position = 1;
      }
    }
    if (this.keys.isActive("up") || this.keys.isHolding("up", this.keyInterval)) {
      this.game.sounds.play("blip");
      this.position += this.cursorPositions.length - 1;
      this.position %= this.cursorPositions.length;
      if (!!this.sent && this.position==0) {
        this.position = this.cursorPositions.length-1;
      }
    }
    if (this.keys.isActive("confirm")) {
      switch (this.position) {
        case 0:
          this.submit();
          break;
        case 1:
          this.game.changeScreen(new GameScreen(this.game));
          break;
        case 2:
          this.game.changeScreen(new HighScoresScreen(this.game));
          break;
        case 3:
          this.game.changeScreen(new MenuScreen(this.game));
          break;
      }
    }

    Object.keys(alphabeth).map(key => {
      if ((this.keys.isActive(key) || this.keys.isHolding(key, this.keyInterval)) && this.name.length <= this.maxNameLength) {
        this.name += key.toUpperCase();
      }
    });
    if (this.keys.isActive("backspace") || this.keys.isHolding("backspace", this.keyInterval)) {
      this.name = this.name.substring(0, this.name.length-1);
    }

    if (this.keys.isActive("backspace") || this.keys.isHolding("backspace", this.keyInterval)) {
      this.name = this.name.substring(0, this.name.length-1);
    }
    if ((this.keys.isActive("spacebar") || this.keys.isHolding("spacebar", this.keyInterval)) && this.name.length <= this.maxNameLength) {
      this.name += " ";
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
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, 150);

    this.ctx.font = SCORE_FONT;
    this.ctx.fillText(`${this.score}`, this.canvas.width / 2, 240);
    this.ctx.font = DISPLAY_FONT;
    if (!this.sent) {
      this.ctx.fillText('SUBMIT', this.canvas.width / 2, 380);
      if (this.blinkTypingCursor) {
        this.ctx.fillText('_', 350+this.name.length*(DISPLAY_FONT_SIZE-9.5), 280);
      }
    }
    this.ctx.fillText('PLAY AGAIN', this.canvas.width / 2, 427);
    this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 475);
    this.ctx.fillText('MENU', this.canvas.width / 2, 522);
    this.ctx.textAlign = "start";
    this.ctx.fillText(`NAME: ${this.name}`, 250, 280);

    this.ctx.font = BOARD_FONT;
    this.cursorMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks([this.cursor], this.cursorMatrix);
    draw.drawLayers(this.ctx, [this.cursorMatrix], this.fillStyle, this.shadowColor);
  }
  submit() {
    if (!this.sent && this.name!="") {
      this.game.firestore.collection(COLLECTION).add({
        name: this.name,
        level: this.level,
        score: this.score
      })
      .catch(error => {
        throw error;
      });
      this.sent = true;
      this.position++;
    } else {
    }
  }
}

export class MenuScreen extends BackgroundScreen {
  init() {
    super.init();
    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.position = 0;
    this.cursorPositions = [
      [12 - this.cursor.bottommost, 6 - this.cursor.rightmost], // PLAY
      [14 - this.cursor.bottommost, 4 - this.cursor.rightmost], // HIGH SCORES
      [16 - this.cursor.bottommost, 6 - this.cursor.rightmost], // MUTE
      [18 - this.cursor.bottommost, 5 - this.cursor.rightmost], // CREDITS
    ];
    this.keyInterval = 200;
    this.update();
  }
  update() {
    super.update();
    if (this.keys.isActive("down") || this.keys.isHolding("down", this.keyInterval)) {
      this.game.sounds.play("blip");
      this.position++;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("up") || this.keys.isHolding("up", this.keyInterval)) {
      this.game.sounds.play("blip");
      this.position += this.cursorPositions.length - 1;
      this.position %= this.cursorPositions.length;
    }
    if (this.keys.isActive("confirm") || this.keys.isActive("hardDrop") || this.keys.isActive("sRight") || this.keys.isActive("sLeft")) {
      switch (this.position) {
        case 0:
          this.game.changeScreen(new GameScreen(this.game));
          break;
        case 1:
          this.game.changeScreen(new HighScoresScreen(this.game));
          break;
        case 2:
          this.game.sounds.mute = !this.game.sounds.mute;
          break;
        case 3:
          this.game.changeScreen(new CreditsScreen(this.game));
          break;
      }
    }
    this.cursor.row = this.cursorPositions[this.position][0];
    this.cursor.col = this.cursorPositions[this.position][1];

    if (!this.game.sounds.isPlaying("theme")) {
      this.game.sounds.loop("theme");
    }
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
    this.ctx.fillText('PLAY', this.canvas.width / 2, 300);
    this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 347);
    this.ctx.fillText('MUTE', this.canvas.width / 2, 395);
    this.ctx.fillText('CREDITS', this.canvas.width / 2, 442);
    this.ctx.fillText('Controls', this.canvas.width / 4, 410);
    this.ctx.font = SMALL_FONT;
    this.ctx.fillText('L/R Arrows: Move', this.canvas.width / 4 , 430);
    this.ctx.fillText('Z, X, Up Arrow: Rotate', this.canvas.width / 4 , 450);
    this.ctx.fillText('Spacebar: Hard Drop', this.canvas.width / 4, 470);
    this.ctx.fillText('Esc: Pause', this.canvas.width / 4, 490);
    this.ctx.fillText('v1.0', this.canvas.width / 4 * 3, 460);
    this.ctx.textAlign = "start";
  }
}

export class HighScoresScreen extends BackgroundScreen {
  init() {
    super.init();

    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.cursor.row = 21 - this.cursor.bottommost;
    this.cursor.col = 6 - this.cursor.rightmost;

    this.data = [];
    this.game.firestore.collection(COLLECTION).orderBy("score", "desc")
      .limit(10)
      .get()
      .then((querySnapshot) => {
        this.data = querySnapshot.docs.map(doc => doc.data());
      });
  }
  update() {
    super.update();
    if (this.keys.isActive("confirm") || this.keys.isActive("hardDrop") || this.keys.isActive("sRight") || this.keys.isActive("sLeft")) {
      this.game.changeScreen(new MenuScreen(this.game));
    }
  }
  draw() {
    super.draw();

    this.ctx.textAlign = "center";

    this.ctx.font = TITLE_FONT;
    this.ctx.fillText('HIGH SCORES', this.canvas.width / 2, 150);
    if (this.data.length == 0) {
      this.ctx.fillText("Waiting data...", this.canvas.width/2, 300);
    } else {
      this.ctx.fillText(`Master ${this.data[0].name}!`, this.canvas.width/2, 230);
    }

    this.ctx.font = DISPLAY_FONT;
    this.ctx.fillText('BACK', this.canvas.width / 2, 510);

    this.ctx.font = HSCORES_FONT;
    this.ctx.textAlign = "start";
    this.data.forEach((data, index) => {
      const col = +(index >= 5);
      const row = index % 5;
      this.ctx.fillText(`${(index+1).toString().padEnd(2," ")}- ${data.name.padEnd(10, " ")}${data.score}`, 130 + 290 * col, 300 + (DISPLAY_FONT_SIZE + 10) * row);
    });

    this.ctx.font = BOARD_FONT;
    this.cursorMatrix = new Array(26).fill(" ".repeat(25));
    draw.placeBlocks([this.cursor], this.cursorMatrix);
    draw.drawLayers(this.ctx, [this.cursorMatrix], this.fillStyle, this.shadowColor);
  }
}

export class CreditsScreen extends BackgroundScreen {
  init() {
    super.init();
    this.cursor = new draw.Block(draw.randomBlockType(), 7, 0, 0, Math.floor(Math.random() * 4));
    this.cursor.row = 21 - this.cursor.bottommost;
    this.cursor.col = 6 - this.cursor.rightmost;
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
    this.ctx.fillText('Tetris', this.canvas.width / 2, 130);
    this.ctx.fillText('Almost From Scratch', this.canvas.width / 2, 175);

    this.ctx.font = DISPLAY_FONT;
    this.ctx.fillText('BACK', this.canvas.width / 2, 510);

    this.ctx.font = SMALL_FONT;
    this.ctx.textAlign = "start";
    const text = [
      "  This is an attempt of making the game tetris with",
      "modern programming languages. You can find more",
      "information about the project in it's github page:",
      "https://github.com/luxedo/asteroids-almost-from-scratch",
      "",
      "  Thanks to archive.org for the theme, n_audioman,",
      "jeckkech and LittleRobotSoundFactory for the sounds in",
      "freesound.org and David Whittaker for the gameover",
      "sound at zxart.ee.",
      "",
      "  Thanks to the playtesters: Ulisses Sato, Pedro Kersten",
      "and Sofia 'faifos' Faria.",
      "",
    ];
    const textCopyright = ["This project is under a GNU GPL3 license. Have fun!",
      "Copyright (C) 2019  Luiz Eduardo Amaral",
      "<luizamaral306(at)gmail.com>"
    ];

    text.forEach((row, idx) => {
      this.ctx.fillText(row, 130, 210 + idx * (SMALL_FONT_SIZE));
    });

    this.ctx.textAlign = "center";
    textCopyright.forEach((row, idx) => {
      this.ctx.fillText(row, this.canvas.width / 2, 430 + idx * (SMALL_FONT_SIZE));
    });
    this.ctx.textAlign = "start";
  }
}
