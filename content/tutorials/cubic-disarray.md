+++
title = "Cubic Disarray"
date = 2018-05-17T09:59:00-04:00
number = "03"
image = "/img/03-cubic-disarray.png"
teaser = "Georg Nees was one of the pioneers of computer art. Cubic disarray is a perfect example of how generative work can be simplistic and powerful at the same time."
+++

# Cubic Disarray

![Cubic Disarray](/img/03-cubic-disarray.png)

[Georg Nees](https://en.wikipedia.org/wiki/Georg_Nees)' fantastic generative art is a true inspiration. In this tutorial, we're going to build one of his pieces: Cubic Disarray.

The only HTML we have on the page is a `<canvas>` element at 320&times;320 pixels.

As usual, here is our initial setup. You're not going to see anything render here, because these are the primary lines to setting up the canvas and context which we use to draw. We will also set the size of the canvas and adjust it based on the user's device pixel ratio, or pixel density. This ensures that the final result is crisp on all monitors.

<div class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');
context.lineWidth = 2;

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);

var squareSize = 30;
{{< / highlight >}}
</div>

We've also got a variable in there to define the square size, understandably named `squareSize`.

Now, let's create a function to draw the squares. This function is going to be fairly simple, taking only a width and a height. The position of the squares is going to be handled by another loop.

<div class="tmd-trigger" data-from="13">
{{< highlight js "linenos=table,linenostart=13" >}}
function draw(width, height) {
  context.beginPath();
  context.rect(-width/2, -height/2, width, height);
  context.stroke(); 
}
{{< / highlight >}}
</div>

So how about we draw something. I'm going to loop through and fill the screen  with squares. Here we're using the context `save`, `translate` & `restore` functions to move the context around, and then our draw function above for drawing.

<div class="tmd-trigger" data-from="19">  
{{< highlight js "linenos=table,linenostart=19" >}}
for(var i = squareSize; i <= size - squareSize; i += squareSize) {
  for(var j = squareSize; j <= size - squareSize; j+= squareSize) {
    context.save();
    context.translate(i, j);
    draw(squareSize, squareSize);
    context.restore();
  }
}
{{< / highlight >}}
</div>

And there we have it, squares! Now we have the "cubic" part down, we can get to the disarray. 

Introducing random is fairly simple: first we'll give ourselves some variables, one for how much the squares translate out of their position, one for how much they rotate, and one for how much to offset the entire drawing to get it centered on the canvas.

<div class="tmd-trigger" data-from="11" data-to="11">  
{{< highlight js "linenos=table,linenostart=11" >}}
var randomDisplacement = 15;
var rotateMultiplier = 20;
var offset = 10;
{{< / highlight >}}
</div>

We can use those variables, then, to create the random translations and rotations. They're set up here to be larger numbers as they reach towards the end of the canvas.

<div class="tmd-trigger" data-from="24" data-to="24" data-indent="2">  
{{< highlight js "linenos=table,linenostart=24" >}}
var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
var rotateAmt = j / size * Math.PI / 180 * plusOrMinus * Math.random() * rotateMultiplier;

plusOrMinus = Math.random() < 0.5 ? -1 : 1;
var translateAmt = j / size * plusOrMinus * Math.random() * randomDisplacement;
  
{{< / highlight >}}
</div>

Now, we apply the translations and rotations. (Suddenly all that setup paid off!)

<div class="tmd-trigger" data-from="31" data-to="32" data-indent="2">  
{{< highlight js "linenos=table,linenostart=31" >}}
context.translate(i + translateAmt + offset, j + offset);
context.rotate(rotateAmt);
{{< / highlight >}}
</div>

And there we have it: cubic disarray!
