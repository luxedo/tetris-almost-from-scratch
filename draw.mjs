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

const blockTypes = {
  'i': [" ■  ", " ■  ", " ■  ", " ■  "],
  'o': ["■■", "■■"],
  't': [" ■ ", "■■■", "   "],
  'l': [" ■ ", " ■ ", " ■■"],
  'j': [" ■ ", " ■ ", "■■ "],
  's': ["■■ ", " ■■", "   "],
  'z': [" ■■", "■■ ", "   "],
};

// Functions
export function drawLayers(ctx, layers) {
  layers.map(layer => {
    layer.map((row, idx) => {
      ctx.fillText(row, 20, idx * 22 + 45);
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
  }
  else if (rot < 0) {
    return rotatePiece(piece, (rot+4)%4);
  } else {
    let l = piece.length;
    let newPiece = new Array(l).fill("".padStart(l));
    piece.map((row, idxRow) => {
      row.split("").map((char, idxCol) => {
        newPiece[l-1-idxCol] = replaceAt(newPiece[l-1-idxCol], idxRow, char);
      });
    });
    return rotatePiece(newPiece, (rot-1)%4);
  }
}

export function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

export function placeBlocks(blocks, layer) {
  blocks.map(block => {
    block.place(layer);
  });
}

export class Block {
  constructor(type, margin, row, col, rot) {
    this.type = type;
    this.margin = margin;
    this.row = row;
    this.col = col;
    this.rot = rot;
    this.piece = blockTypes[type];
  }

  place(layer) {
    let rotPiece = rotatePiece(this.piece, this.rot);
    rotPiece.map((line, idxRow) => {
      line.split("").map((char, idxCol) => {
        layer[this.row + idxRow] = replaceAt(layer[this.row + idxRow], this.margin + this.col + idxCol, char);
      });
    });
  }

  move(rows, cols) {
    this.row += rows;
    this.col += cols;
  }
}
