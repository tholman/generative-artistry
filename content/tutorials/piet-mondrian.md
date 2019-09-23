+++
title = "Piet Mondrian"
date = 2018-08-27T09:59:00-04:00
image = "/img/08-mondrian.png"
iama = "tutorial"
teaser = "Piet Mondrians art is world renoun, there's also something about his style that makes it irresistable to try to replicate with code."
+++

# Piet Mondrian

Replicating [Piet Mondrian's](https://en.wikipedia.org/wiki/Piet_Mondrian) art with code is no easy task, in fact honestly I'd say there's no real way of pinning down his creations entirely with code, they were hand made. That said, we can try to replicate something within the realm of what would have been one of Piet's works... so that's what we will do in this tutorial... and yes, we will add the color as well.

As usual, here is our initial setup. Using `window.devicePixelRatio` to scale the canvas on retina screens, and setting our canvas size, with only a html `<canvas>` on the page.

<div class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size _ dpr;
canvas.height = size _ dpr;
context.scale(dpr, dpr);
context.lineWidth = 8;
{{< / highlight >}}

</div>

Now, the approach I'd like to take isn't perfect, but what I'd like to do is start with a big square (the canvas) and then start to divide it up... we will pick a line, either horizontally or vertically and break any squares in that area... after that, we'll add some random to the splitting, so not all squares are split, which should give us something around the famous Mondrian look, albeit probably a little more mathematically rigid.

We'll create an array of squares.

<div class="tmd-trigger" data-from="11">
{{< highlight js "linenos=table,linenostart=11" >}}
var squares = [{
    x: 0,
    y: 0,
    width: size,
    height: size
  }];
{{< / highlight >}}
</div>

And, as I like to do, we'll create our "draw" function and call it, so we can see what we're making.

<div class="tmd-trigger" data-from="20">
{{< highlight js "linenos=table,linenostart=20" >}}
function draw() {
  for (var i = 0; i < squares.length; i++) {
    context.beginPath();
    context.rect(
      squares[i].x,
      squares[i].y,
      squares[i].width,
      squares[i].height
    );
    context.stroke();
  }
}

draw()
{{< / highlight >}}

</div>

This is looping through all of our squares (just one at the moment, and drawing it on the canvas).

Now, we can create a function to find which squares should be split... and then the function to split the square in the direction we've given.

<div class="tmd-trigger" data-from="18" data-to="19">
{{< highlight js "linenos=table,linenostart=18" >}}
function splitSquaresWith(coordinates) {
  // Loops through the squares, and find if
  // one should be split
}

function splitOnX(square, splitAt) {
// Create two new squares, based on
// splitting the given one at the
// x coordinate given
}

function splitOnY(square, splitAt) {
// Create two new squares, based on
// splitting the given one at the
// y coordinate given
}

splitSquaresWith({x: 160})
splitSquaresWith({y: 160})
{{< / highlight >}}

</div>

You can see at the bottom that I'm also calling the split the squares on the `x` and `y`, both in the middle. If these work, we'll know we can do a lot more splitting. But for now, these will be great for testing.

First, the `splitSquaresWith` function.

<div class="tmd-trigger" data-from="19" data-to="21" data-indent="1">
{{< highlight js "linenos=table,linenostart=19" >}}
const { x, y } = coordinates;

for (var i = squares.length - 1; i >= 0; i--) {
const square = squares[i];

if (x && x > square.x && x < square.x + square.width) {
squares.splice(i, 1);
splitOnX(square, x);
}

if (y && y > square.y && y < square.y + square.height) {
squares.splice(i, 1);
splitOnY(square, y);
}
}
{{< / highlight >}}

</div>

There's a bit going on here, including some cheeky little tricks.

- `const { x, y } = coordinates` is extracting the `x` and `y` variables out of the object we're passing, eg `{x: 160}` or `{y: 160}`
- We're looping backwards through the squares with `(var i = squares.length - 1; i >= 0; i--)` this is because we're taking elements **out** of the loop (and replacing them with 2 squares), looping backwards means the order will stay the same, and the new items won't be split again.

Of course, our single square has disappeared because we need to fill out the `splitOn` functions, these are going to look pretty similar.

<div class="tmd-trigger" data-from="37" data-to="40" data-indent="1">
{{< highlight js "linenos=table,linenostart=37" >}}
var squareA = {
  x: square.x,
  y: square.y,
  width: square.width - (square.width - splitAt + square.x),
  height: square.height
};

var squareB = {
x: splitAt,
y: square.y,
width: square.width - splitAt + square.x,
height: square.height
};

squares.push(squareA);
squares.push(squareB);
{{< / highlight >}}

</div>

And...

<div class="tmd-trigger" data-from="56" data-to="59" data-indent="1">
{{< highlight js "linenos=table,linenostart=37" >}}
var squareA = {
  x: square.x,
  y: square.y,
  width: square.width,
  height: square.height - (square.height - splitAt + square.y)
};

var squareB = {
x: square.x,
y: splitAt,
width: square.width,
height: square.height - splitAt + square.y
};

squares.push(squareA);
squares.push(squareB);
{{< / highlight >}}

</div>

These two functions are creating two squares, where the previous single square was, and then adding them back into our `squares` array. You can see by splitting in the two centers, we've made a window.

Instead of our two practice splits, we'll create a `step` variable, and split on that step over and over.

<div class="tmd-trigger" data-from="10" data-to="10">
{{< highlight js "linenos=table,linenostart=10" >}}
var step = size / 6;
{{< / highlight >}}
</div>

And then the loop.

<div class="tmd-trigger" data-from="75" data-to="77">
{{< highlight js "linenos=table,linenostart=75" >}}
for (var i = 0; i < size; i += step) {
  splitSquaresWith({ y: i });
  splitSquaresWith({ x: i });
}
{{< / highlight >}}
</div>

Whew, that was a lot of set up... we can get into the `random` now. Rather than splitting each and every square when we hit it, we'll only split them half the time.

<div class="tmd-trigger" data-from="26" data-to="28" data-indent="3">
{{< highlight js "linenos=table,linenostart=26" >}}
if(Math.random() > 0.5) {
  squares.splice(i, 1);
  splitOnX(square, x); 
}
{{< / highlight >}}
</div>

Ooh, looking good. And on the `y` axis too!

<div class="tmd-trigger" data-from="33" data-to="35" data-indent="3">
{{< highlight js "linenos=table,linenostart=33" >}}
if(Math.random() > 0.5) {
  squares.splice(i, 1);
  splitOnY(square, y); 
}
{{< / highlight >}}
</div>

And there we have it, the shapes and structure we want! As always, with these tutorials you can hit the small arrow sitting between the editor and the demo and the code will rerun, if you press it a few times now, you'll see our Mondrian structure take a few different shapes.

Let's add some color in. First the variables, using those beautiful red, blue and yellow colors.

<div class="tmd-trigger" data-from="11" data-to="11">
{{< highlight js "linenos=table,linenostart=11" >}}
var white = '#F2F5F1';
var colors = ['#D40920', '#1356A2', '#F7D842']
{{< / highlight >}}
</div>

We'll pick three random squares, and give each of them a `color`. You might see only one or two colors, and that is because the same square was randomly selected twice.

<div class="tmd-trigger" data-from="87" data-to="87" data-indent="1">
{{< highlight js "linenos=table,linenostart=87" >}}
for (var i = 0; i < colors.length; i++) {
  squares[Math.floor(Math.random() * squares.length)].color = colors[i];
}
{{< / highlight >}}
</div>

And of course, making sure the draw function colors them in.

<div class="tmd-trigger" data-from="98" data-to="98" data-indent="2">
{{< highlight js "linenos=table,linenostart=97" >}}
if(squares[i].color) {
  context.fillStyle = squares[i].color;
} else {
  context.fillStyle = white
}
context.fill()
{{< / highlight >}}
</div>

Colors, beautiful! Again, if you don't see any, it should be a matter of hitting the arrow on the side a few times.

You can see now as well, how simple it is to add or remove complexity based on the grid.

<div class="tmd-trigger" data-from="10" data-to="11">
{{< highlight js "linenos=table,linenostart=10" >}}
var step = size / 20;
{{< / highlight >}}
</div>

<div class="tmd-trigger" data-from="10" data-to="11">
{{< highlight js "linenos=table,linenostart=10" >}}
var step = size / 4;
{{< / highlight >}}
</div>

<div class="tmd-trigger" data-from="10" data-to="11">
{{< highlight js "linenos=table,linenostart=10" >}}
var step = size / 7;
{{< / highlight >}}
</div>

And there we have it, a Mondrian. Please, hit the link below to have a play on CodePen, play with the colors, how you apply them, play with the split percentages. It's all good fun!
