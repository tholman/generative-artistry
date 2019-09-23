+++
title = "Hypnotic Squares"
date = 2018-08-26T09:59:00-04:00
image = "/img/07-hypnotic-squares.png"
iama = "tutorial"
teaser = "William Kolomyjec was another great pioneer of generative art. This piece, \"Hypnotic Squares\", is a great example of recursion in action."
+++

# Hypnotic Squares

[William Kolomyjec](http://dada.compart-bremen.de/item/agent/644)'s work is again reminiscent of some of the old school generative works, focusing on simple shapes, tiling and recursion.

Today we're going to replicate a piece of his called Hypnotic Squares.

The only HTML we have on the page is a `<canvas>` element at 320&times;320 pixels.

As usual, here is our initial setup. Using `window.devicePixelRatio` to scale the canvas on retina screens, and setting our canvas size.

<div class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size _ dpr;
canvas.height = size _ dpr;
context.scale(dpr, dpr);
context.lineWidth = 2;
{{< / highlight >}}

</div>

Now, to create this piece we're going to need to set a few variables, and then we will create our draw function. The goal will be to create a function that uses `recursion` to draw squares inside itself, until they reach a certain minimum size.

If you don't know much about recursion, that's totally ok! I will explain it as we go through.

<div class="tmd-trigger" data-from="11">
{{< highlight js "linenos=table,linenostart=11" >}}
var finalSize = 10;
var startSize = size;
var startSteps = 5;

function draw(x, y, width, height, xMovement, yMovement, steps) {
// We will fill this in
}

draw(0, 0, startSize, startSize, 0, 0, startSteps);
{{< / highlight >}}

</div>

The `steps` in the draw function, is how many times our square will recurse inwards. It's a fixed variable now, but we will be able to make it a little bit more random later.

The `finalSize` is the smallest square we want to draw, when our squares start to get this small, we'll stop drawing.

The `startSteps` will help us calculate a smaller and smaller square as we recurse.

Let's make our `draw` function draw. We'll start with just a plain square.

<div class="tmd-trigger" data-from="16" data-to="17" data-indent="1">
{{< highlight js "linenos=table,linenostart=16" >}}
context.beginPath();
context.rect(x, y, width, height);
context.stroke();
{{< / highlight >}}
</div>

Now we have a single square, its time for some recursion. This means that the draw function will be calling itself over and over, until we reach a certain condition, this condition is pretty important, otherwise the loop will never end. We will use `steps` and count down.

<div class="tmd-trigger" data-from="19" data-to="19" data-indent="1">
{{< highlight js "linenos=table,linenostart=19" >}}
  
if(steps >= 0) {
  var newSize = (startSize) * (steps / startSteps) + finalSize;
  var newX = x + (width - newSize) / 2
  var newY = y + (height - newSize) / 2
  draw(newX, newY, newSize, newSize, xMovement, yMovement, steps - 1);
}
{{< / highlight >}}
</div>

Woohoo, recursion! So let me explain whats going on above.

- `newSize` is being calculated based on how many steps our square has remaining.
- `newX` & `newY` is being calculated based on making sure the new square fits inside the previous one.
- And then, the final parameter in the `draw` function is `steps - 1` which means we step closer and closer to 0.

So you can see now if we change the `startSteps` variable, to a few differnt variations, we'll have different degrees of recursion.

<div class="tmd-trigger" data-from="13" data-to="14">
{{< highlight js "linenos=table,linenostart=14" >}}
var startSteps = 8;
{{< / highlight >}}
</div>

or

<div class="tmd-trigger" data-from="13" data-to="14">
{{< highlight js "linenos=table,linenostart=14" >}}
var startSteps = 4;
{{< / highlight >}}
</div>

We can see that randomizing this value will give us different outputs, but lets add a little more to it first. You can see the two variables `xMovement` and `yMovement`... we want to use these variables to "tilt" the squares in a certain direction.

First, I'll update the draw call, to represent this, with `xMovement` and `yMovement` both being 1. We will want this to tilt the square to the bottom right.

<div class="tmd-trigger" data-from="28" data-to="29">
{{< highlight js "linenos=table,linenostart=28" >}}
draw(0, 0, startSize, startSize, 1, 1, startSteps);
{{< / highlight >}}
</div>

And here's what we will do, to calculate this.

<div class="tmd-trigger" data-from="24" data-to="24" data-indent="2">
{{< highlight js "linenos=table,linenostart=28" >}}
newX = newX - ((x - newX) / (steps + 2)) * xMovement
newY = newY - ((y - newY) / (steps + 2)) * yMovement
{{< / highlight >}}
</div>

This looks a little complex... we're calculating how big each step is going to be (difference between the bigger and smaller square sizes) and then dividing it by how many steps are left. The 2 is to make sure that the new square never quite touches the line of the previous one.

Now, if we change around our draw function, you'll be able to see how it moves around and renders in different ways.

<div class="tmd-trigger" data-from="30" data-to="31">
{{< highlight js "linenos=table,linenostart=28" >}}
draw(0, 0, startSize, startSize, 1, 0, startSteps);
{{< / highlight >}}
</div>

<div class="tmd-trigger" data-from="30" data-to="31">
{{< highlight js "linenos=table,linenostart=30" >}}
draw(0, 0, startSize, startSize, 1, -1, startSteps);
{{< / highlight >}}
</div>

<div class="tmd-trigger" data-from="30" data-to="31">
{{< highlight js "linenos=table,linenostart=30" >}}
draw(0, 0, startSize, startSize, 0, -1, startSteps);
{{< / highlight >}}
</div>

<div class="tmd-trigger" data-from="30" data-to="31">
{{< highlight js "linenos=table,linenostart=30" >}}
draw(0, 0, startSize, startSize, -1, -1, startSteps);
{{< / highlight >}}
</div>

Ok, now that we have our draw function down, we're going to do something we did in our very first [tiled lines](/tutorials/tiled-lines) tutorial... and that is, tile!

Firstly some variables, about how often we will tile our squares, and a little offset to center the square a little more... we will make the final size smaller, and calculate `tileStep` to be the width of our `canvas` minus the `offset`divided by how many squares we want (`7`). And then, a final array of all the possible directions we can go in `-1, 0 & 1`

<div class="tmd-trigger" data-from="11" data-to="14">
{{< highlight js "linenos=table,linenostart=11" >}}
var finalSize = 3;
var startSteps;
var offset = 2;
var tileStep = (size - offset * 2) / 7;
var startSize = tileStep;
var directions = [-1, 0, 1];
{{< / highlight >}}
</div>

Yep, it looks broken, because we're now going to use these variables to draw the tiles across our screen.

<div class="tmd-trigger" data-from="33" data-to="34">
{{< highlight js "linenos=table,linenostart=33" >}}
for( var x = offset; x < size - offset; x += tileStep) {
  for( var y = offset; y < size - offset; y += tileStep) {
    startSteps = 3
    draw(x, y, startSize, startSize, 1, 1, startSteps - 1);
  }
}
{{< / highlight >}}
</div>

Now we're really set up to play. We can add a random amount of steps.

<div class="tmd-trigger" data-from="35" data-to="36" data-indent="2">
{{< highlight js "linenos=table,linenostart=35" >}}
startSteps = 2 + Math.ceil(Math.random() * 3)
{{< / highlight >}}
</div>

And some random directions!

<div class="tmd-trigger" data-from="36" data-to="37" data-indent="2">
{{< highlight js "linenos=table,linenostart=37" >}}
var xDirection = directions[Math.floor(Math.random() * directions.length)]
var yDirection = directions[Math.floor(Math.random() * directions.length)]
draw(x, y, startSize, startSize, xDirection, yDirection, startSteps - 1);
{{< / highlight >}}
</div>

And there we have it! Hypnotic Squares. This is a great example of some beautiful use of recursion, as well as the kind of art piece that can easily be expanded with some color, especially on a slightly larger canvas.
