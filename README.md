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
*   ~~Create "gravity" and game timing~~
*   ~~Tweak the user input mechanics~~
*   ~~Implement rotation mechanics~~
*   ~~Create collision mechanics~~
*   ~~Create line destruction mechanics~~
*   ~~Create levels/scoring~~
*   Create game over mechanics
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
It was quite easy to cleanup the old game, now I have a clean canvas to start
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
Since these **almost-from-scratch** projects always have a few twists, I will
compress the lines and draw the blocks with a single character.
![board compressed spacing](/report-assets/board_compressed_spacing.png)

## 03:45 - Update drawing/writing functions
First of all, I had to change the structure of the project because of some
annoying messages in my editor about variables out of scope. I renamed the files
to use them as modules and use the [`import` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).

![modules](/report-assets/modules.png)

Then, I proceeded to creating the drawing functions. First I wrote the data for
the tetrominoes. They're just some ■ characters in the correct position.

![tetrominoes](/report-assets/tetrominoes.png)

We also need to rotate the tetrominoes, I did not put much tought in for the
rotation for now. The final result looks like this:

![rotation](/report-assets/rotation.png)

## 04:00 - Create the 'block' class
With the drawing functions in place, it was quite easy to draw the blocks. We
don't have the collision mechanics nor the user input, that will change the
class quite a bit.

![moving](/report-assets/moving.gif)


## 04:20 - Create "gravity" and game timing
Gravity was quite simple to implement, just move the block down at a certain
interval. Then, this interval was added to a variable to set the level of
difficulty afterwards.

## 06:30 - Tweak the user input mechanics
First of all, I had to rewrite the gameloop. The old version was very confusing
and hard to tweak. Now it's simpler and I wrote using ES6 `class` notation. This
refactoring took quite some time.

![game class](/report-assets/game_class.png)

I have deleted the old user input, so we're going to make it again. I salvaged
some of the old code, but to summarize I made a class that listen for the `keyup`
and `keydown` events and stores the pressed buttons in an `object`. I also
implemented three handful methods:
-   `isDown` - Checks if the current key is pressed
-   `isActive` - Checks if the current may be triggered again. The key gets active again if the player releases it.
-   `isHolding` - Checks if the current key is being held for an specified time interval. This is useful to make the tetrominoes move when the player holds the key.

After this refactoring we can move the pieces!!

![input](/report-assets/input.gif)

## 7:00 - Implement rotation mechanics
Looking up in the interwebs, I found that the rotation mechanics has a name,
it's called [Super Rotation System](http://tetris.wikia.com/wiki/SRS) or **SRS**
for short.

![pieces rotation map](https://i.stack.imgur.com/JLRFu.png)

Fortunately, the simple rotation method that I implemented previously is exactly
the **SRS**, So I don't need to change it:

![srs](/report-assets/srs.gif)


## 11:40 - Create collision mechanics
Now we need to know when the pieces are touching the borders of the board.
There are two checks that needs to be done:
1. Check for collision with the walls and bottom.
2. Check for collision in spinning moves and
[Wall Kick](http://tetris.wikia.com/wiki/Wall_kick) the tetromino when
applicable.

There's a third check that could be made, the
[T Spin](http://tetris.wikia.com/wiki/T-Spin). Hopefully it will occur naturally.

To do this, each update fires a function to check for the sides of the pieces,
if the piece is going through a wall then it's kicked back or rotated back
(before the draw). If the bottommost side of the piece is below another piece or
wall, then it's kicked back and locked in place.

To do this it took quite some time. Sometimes the pieces would clip into each
other, or rotate apparently at random. But alas it's done. The main problems that
I had were to prioritize the actions to apply to the pieces according to user input.
Eg: if the user spins and the piece kicks off the wall, then by rotating it again
it wouldn't go back to it's previous position.

![collision](/report-assets/collision.gif)

## 12:10 - Create line destruction mechanics
And we're half way there! So far we have a playable demo, but the lines that are
full doesn't break.

The solution for this was to just filter the array that contains the placed
blocks for complete rows. Then I map over the array sliding down all pieces that
were above that line.

![break](/report-assets/break.gif)


## 13:00 - Create levels/scoring
The scoring system I used was the [Original Nintendo Scoring System](http://tetris.wikia.com/wiki/Scoring). In summary it is a table of a base according to the number of broken lines times the current level+1.

For the levels, I chose to increase it for every 10 broken lines, as in the NES version.

To show the socores (`СЧЕТ`) and the level (`УРОВЕНЬ`) I decided to use the original words in russian.

![score](/report-assets/score.gif)
