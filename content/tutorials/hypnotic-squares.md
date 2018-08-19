+++
title = "Hypnotic Squares"
date = 2018-09-11T09:59:00-04:00
number = "07"
image = "/img/07-hypnotic-squares.png"
teaser = "William Kolomyjec was another of the great pioneers of generative art, this piece, hypnotic squares is a great example of recursion in action."
+++

# Hypnotic Squares

[Georg Nees](https://en.wikipedia.org/wiki/Georg_Nees)' fantastic generative art is a true inspiration. In this tutorial, we're going to build one of his pieces: Cubic Disarray.

The only HTML we have on the page is a `<canvas>` element at 300x300 pixels.

As usual, here is our initial setup. You're not going to see anything render here, because these are the primary lines to setting up the canvas and context which we use to draw.

<div id="tmd-1" class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
context.lineWidth = 2;

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;

var squareSize = 30;
  
{{< / highlight >}}
</div>

We've also got a variable in there to define the square size, understandably named `squareSize`.

Now, let's create a function to draw the squares. This function is going to be fairly simple, taking only a width and a height. The position of the squares is going to be handled by another loop.

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="inject" data-to="12">
{{< highlight js "linenos=table,linenostart=11" >}}
function draw(width, height) {
  context.beginPath();
  context.rect(-width/2, -height/2, width, height);
  context.stroke(); 
}
{{< / highlight >}}
</div>