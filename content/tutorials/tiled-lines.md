+++
title = "Tiled Lines"
date = 2018-05-04T09:59:00-04:00
number = "01"
image = "/img/01-tiled-lines.png"
teaser = "This demo is one of the most simplistic yet beautiful pieces of generative art you can make. It's kinda famous in its own right, appearing on books and on all sorts of devices."
+++

# Tiled Lines


I want to get going with some of the earliest but simplest programming art out there. I'm referring to the [10 PRINT](https://www.youtube.com/watch?v=m9joBLOZVEo) artwork initially coded for the Commodore 64.

This work has been featured all over the place, and gives a really stunning effect for something so simple. To give you an example of what it looks like, it's this.

<!-- ![The demo]({{site.url}}/assets/images/01-tiled-lines.png) -->

We're going to do this with the javascript canvas. No extra API's today. The only HTML we have on the page is a `<canvas>` element at 300x300 pixels.

Let's kick things off with some initial setup. You're not going to see anything render here, because these are the primary lines to setting up the canvas and context which we use to draw.

<div id="tmd-1" class="tmd-trigger" data-from="0" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;
 
{{< / highlight >}}
</div>

This will set us up with a canvas with a square size ~ and provide us with the ever useful "context" of which we use to draw.

Now, let's create a draw function, which we will be using to draw. It's going to accept an x, y, width and height. Let's also call that draw function, even though it's empty.

<div id="tmd-2" class="tmd-trigger" data-from="10" data-action="inject" data-to="10">
{{< highlight js "linenos=table,linenostart=9" >}}
function draw(x, y, width, height) {
  // TODO: Functionality here
}

draw(0, 0, size, size);
{{< / highlight >}}
</div>

The way that this is built out at the moment, we will use the `draw` function to draw out something from the x and y coordinates of `(0, 0)`, to the full width and height of the canvas.

So how about we draw something. Let's start with a simple line.

<div id="tmd-3" class="tmd-trigger" data-action="replace" data-from="10" data-to="11">  
{{< highlight js "linenos=table,linenostart=10" >}}
  context.moveTo(x, y);
  context.lineTo(x + width, y + height);   
  context.stroke();
{{< / highlight >}}
</div>

And there we have it: a diagonal line, going from our top left to the bottom right of the canvas space. But at the moment, that's static. 

To make it "generative" we'll need to change it so that 50% of the time, it will go from the top right to the bottom left instead, taking the "art" out of our hands and into the computers.

To use that, we will add a random chance boolean and an if statement.

<div id="tmd-4" class="tmd-trigger" data-action="replace" data-from="10" data-to="13">  
{{< highlight js "linenos=table,linenostart=10" >}}
  var leftToRight = Math.random() >= 0.5;

  if( leftToRight ) {
    context.moveTo(x, y);
    context.lineTo(x + width, y + height);    
  } else {
    context.moveTo(x + width, y);
    context.lineTo(x, y + height);
  }

  context.stroke();
{{< / highlight >}}
</div>

`Math.random()` is returning a number between 0 and 1, which gives us the 50% chance of going one way or the other. Now, if you hit the "send it" button on the left over and over, you will see the line changing direction randomly.

Now, the final step is to divide and conquer. One line is cool, but do you know what's better? Hundreds of lines.

We will add in a variable to be our "step".

<div id="tmd-5" class="tmd-trigger" data-action="inject" data-from="5" data-to="5">  
{{< highlight js "linenos=table,linenostart=5" >}}
var step = 100;
{{< / highlight >}}
</div>

This variable is what we will use to step through our image. In this case, our width is 400, and our step is 100, so we know it fits in 4 times.

<div id="tmd-6" class="tmd-trigger" data-action="replace" data-from="24" data-to="25">  
{{< highlight js "linenos=table,linenostart=24" >}}
for( var x = 0; x < size; x += step) {
  for( var y = 0; y < size; y+= step ) {
    draw(x, y, step, step);    
  }
}
{{< / highlight >}}
</div>

Kapow, how about that. So now, we can reduce the step to say:

<div id="tmd-5" class="tmd-trigger" data-action="replace" data-from="5" data-to="6">  
{{< highlight js "linenos=table,linenostart=5" >}}
var step = 20;
{{< / highlight >}}
</div>

And we have a much more complex, beautiful piece. In fact, I'd almost call that done!

Feel free to play around with the variables in the code to the top left... really, `step` is the one you should be most interested in. But you can also play around with `draw` and create something new by drawing something a little more complex than just diagonal lines.
