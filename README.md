# TETRIS ALMOST FROM SCRATCH
This is an attempt of making the game [Tetris](https://en.wikipedia.org/wiki/Tetris) using modern programming languages. The idea is to time the development and track the progress and the time it took to get in each stage in this document. If possible I want to finish this project in under 12 h.

Tetris is the first software to be exported from the USSR to the US and became and not only became one of the most famous computer games, it has been released for nearly every videogame console and computer operating system.

For this project, I'll be using the engine built for the [tetris-almost-from-scratch](https://github.com/ArmlessJohn404/tetris-almost-from-scratch). I'll try to improve it and try to draw only characters on screen. The idea is to simulate the original game and also show an improved view using the same engine.
![original tetris](https://upload.wikimedia.org/wikipedia/en/7/7c/Tetris-VeryFirstVersion.png)

The game is based in html5/canvas, CSS and ES6 javascript.

#### Check it out [here](https://armlessjohn404.github.io/tetris-almost-from-scratch/)

## Goals
*   ~~Add `LICENSE.md` and `README.md`~~
*   ~~Host somewhere~~
*   ~~Copy [TETRIS](https://armlessjohn404.github.io/pong-almost-from-scratch/) project base~~
*   ~~Cleanup the old game~~
*   ~~Create the board~~
*   ~~Update drawing/writing functions~~
*   ~~Create the 'block' class~~
*   Tweak the user input mechanics
*   Create "gravity" and game timing
*   Create collision mechanics
*   Create line destruction mechanics
*   Create game over mechanics
*   Create scoreboard
*   Create "next piece" display
*   Create high-scores
*   Add sounds
*   Improve webpage
*   Finished!

## Progress reports
00:00 - START! Well, now it's 6th of June 2017 and I'm a little drunk already.
I'm not going to work that much today but at least it's a beginning.

## 00:30 - Copied files from TETRIS project and hosted the page
Well, I'm quite slow today, but the foundations have been built. The game should
be available already using [gh-pages](https://pages.github.com/)

## 00:45 - Cleanup the old game
It was quite easy to cleanup the old game, now we have a clean canvas to start
working.

## 01:30 - Creating the board
#### Aaaaand two years later we're back
The idea to render the game, is to use fixed character positions and draw layers
of characters over this grid. The background layer should be the board and any
other data from sides of the board. I used a *mono spaced* font and intend to
use a [black square ■ from UTF-8](https://www.fileformat.info/info/unicode/char/25a0/index.htm) as the building blocks for the [tetrominoes](https://en.wikipedia.org/wiki/Tetromino).
One problem, is that using a regular space between the lines results in a weird
board shape:
![board regular spacing](/report-assets/board_regular_spacing.png)
The original developer, [Alexey Pajitnov](https://en.wikipedia.org/wiki/Alexey_Pajitnov),
solved this problem by using two characters for each block in the tetrominoes.
Since these **almost-from-scratch** projects always have a few twists, we will
compress the lines and draw the blocks with a single character.
![board compressed spacing](/report-assets/board_compressed_spacing.png)

## 04:45 - Update drawing/writing functions
First of all, I had to change the structure of the project because of some
annoying messages in my editor about variables out of scope. I renamed the files
to use them as modules and use the [`import` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
![modules](/report-assets/modules.png)

Then, I proceeded to creating the drawing functions. First I wrote the data for
the tetrominoes. They're just some ■ characters in the correct position.
![tetrominoes](/report-assets/tetrominoes.png)
We also need to rotate the tetrominoes, which is simple for some pieces but not
for others. I followed the [Super Rotation System](http://tetris.wikia.com/wiki/SRS)
which explain how the pieces should behave:

![board compressed spacing](https://i.stack.imgur.com/JLRFu.png)

The final result looks like this:

![board compressed spacing](/report-assets/rotation.png)

## 04:45 - Create the 'block' class
