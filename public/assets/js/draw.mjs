/*
tetris-almost-from-scratch
This is an attempt of making the game tetris using modern programming languages

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

export const blockTypes = {
  "i": ["    ", "■■■■", "    ", "    "],
  "o": ["■■", "■■"],
  "t": [" ■ ", "■■■", "   "],
  "l": ["   ", "■■■", "■  "],
  "j": ["   ", "■■■", "  ■"],
  "s": ["■■ ", " ■■", "   "],
  "z": [" ■■", "■■ ", "   "],
  ".": ["■"]
};

// Functions
export function drawLayers(ctx, layers, fillStyle, shadowColor) {
  ctx.fillStyle = fillStyle;
  ctx.shadowColor = shadowColor;
  layers.forEach(layer => {
    layer.forEach((row, idx) => {
      ctx.fillText(row, 20, idx * 24 + 40);
    });
  });
}

export function placePiece(board, margin, piece, row, col, rot) {
  let rotPiece = rotatePiece(piece, rot);
  rotPiece.map((line, idxRow) => {
    line.split("").map((char, idxCol) => {
      board[row + idxRow] = replaceAt(board[row + idxRow], margin + col + idxCol, char);
    });
  });
}

export function rotatePiece(piece, rot) {
  if (rot == 0) {
    return piece;
  } else if (rot < 0) {
    return rotatePiece(piece, (rot + 4) % 4);
  } else {
    let l = piece.length;
    let newPiece = new Array(l).fill("".padStart(l));
    piece.map((row, idxRow) => {
      row.split("").map((char, idxCol) => {
        newPiece[l - 1 - idxCol] = replaceAt(newPiece[l - 1 - idxCol], idxRow, char);
      });
    });
    return rotatePiece(newPiece, (rot - 1) % 4);
  }
}

export function replaceAt(string, index, replace) {
  if (string === undefined) return "";
  return string.substring(0, index) + replace + string.substring(index + 1);
}

export function placeBlocks(blocks, layer) {
  blocks.map(block => {
    block.place(layer);
  });
}

export class Block {
  constructor(type, margin, row, col, rot, color) {
    this.type = type;
    this.margin = margin;
    this.row = row;
    this.col = col;
    this.rot = rot;
    this.piece = blockTypes[type];
    this.pieceRot = null;
    this.rotate(rot);
  }

  place(layer) {
    this.pieceRot.map((line, idxRow) => {
      line.split("").map((char, idxCol) => {
        layer[this.row + idxRow] = replaceAt(layer[this.row + idxRow], this.margin + this.col + idxCol, char);
      });
    });
  }

  move(rows, cols) {
    this.row += rows;
    this.col += cols;
  }

  rotate(addRotation) {
    this.rot += addRotation;
    this.rot %= 4;
    this.pieceRot = rotatePiece(this.piece, this.rot);
  }
  get leftpad() {
    return this.pieceRot.reduce((acc, cur) => {
      const pad = cur.length - cur.trimStart().length;
      return pad < acc ? pad : acc;
    }, Infinity);
  }
  get rightpad() {
    return this.pieceRot.reduce((acc, cur) => {
      const pad = cur.length - cur.trimEnd().length;
      return pad < acc ? pad : acc;
    }, Infinity);
  }
  get bottompad() {
    return this.pieceRot.map(row => row
      .trim().length)
      .reverse()
      .reduce((acc, cur) => {
        if (!acc.done) {
          if (cur == 0) acc.rows++;
          else acc.done = true;
        }
        return acc;
      }, {rows: 0, done: false}).rows;
  }
  get toppad() {
    return this.pieceRot.map(row => row
      .trim().length)
      .reduce((acc, cur) => {
        if (!acc.done) {
          if (cur == 0) acc.rows++;
          else acc.done = true;
        }
        return acc;
      }, {rows: 0, done: false}).rows;
  }
  get width() {
    return this.pieceRot[0].length;
  }
  get height() {
    return this.pieceRot.length;
  }
  get leftmost() {
    return this.col + this.leftpad;
  }
  get rightmost() {
    return this.col + this.width - this.rightpad;
  }
  get bottommost() {
    return this.row + this.height - this.bottompad;
  }
  get topmost() {
    return this.row - this.toppad;
  }
  get coordinates() {
    return this.pieceRot
      // .filter(line => line.trim().length != 0)
      .map((line, idxRow) => {
        return line.split("")
          .map((char, idxCol) => char != " " ? [idxRow + this.row, idxCol + this.col] : null)
          .filter(coord => coord !== null);
      })
      .flat();
  }
  get type() {return this._type;}
  set type(type) {
    this._type = type;
    this.piece = blockTypes[type];
  }
}

export const randomBlockType = () => {
  const blockNames = Object.keys(blockTypes);
  const totalBlocks = blockNames.length;
  let blockType;
  do {
    blockType = blockNames[Math.floor(Math.random() * totalBlocks)];
  }
  while (blockType === ".");
  return blockType;
};
