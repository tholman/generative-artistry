+++
title = "Joy Division"
date = 2018-05-04T09:59:00-04:00
number = "02"
image = "/img/02-joy-division.png"
teaser = "We've all seen this album cover in one form or another. Come and see how we can make a simple version of it."
+++


# Joy Division

The joy division album cover has a [cool](https://blogs.scientificamerican.com/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/) history, and is a beautiful example of data driven art, in this tutorial we're going to recreate it in a more simplistic form.

We're going to do this with the javascript canvas. No extra API's. The only HTML we have on the page is a `<canvas>` element at 300x300 pixels.

Lets kick things off with some initial setup. You're not going to see anything render here, because these are the primary lines to setting up the canvas and context which we use to draw.

<div id="tmd-1" class="tmd-trigger" data-from="0" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=0" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;
 
{{< / highlight >}}
</div>

This gives us access to the `context` which allows us to draw on the page. 

Our plan of attack here, is to initially create the lines on the canvas, which will be a string of points. From there, we will start to displace the points randomly, to give us the effect we desire.

Lets get some base variables in here, step which will be the steps in pixels between out points, and an array called lines. Which is going to hold our lines.

<div id="tmd-2" class="tmd-trigger" data-from="9" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=0" >}}

var step = 10;
var lines = [];
{{< / highlight >}}
</div>

Now we'll write a function to prepare our lines. A line will consist of a series of points, with an `x` and `y` property.

<div id="tmd-3" class="tmd-trigger" data-from="15" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=0" >}}

// Create the lines
for( var i = step; i <= size - step; i += step) {
    
  var line = [];
  for( var j = step; j <= size - step; j+= step ) {
    var point = {x: j, y: i};
    line.push(point)
  } 
  lines.push(line);
}

{{< / highlight >}}
</div>

Our next step, will be to draw these lines. Again, we'll start simple to get something on the page, and we will expand on it later.

<div id="tmd-4" class="tmd-trigger" data-from="24" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=0" >}}

// Do the drawing
for(var i = 0; i < lines.length; i++) {

  context.beginPath();
  context.moveTo(lines[i][0].x, lines[i][0].y)
  
  for( var j = 0; j < lines[i].length; j++) {
    context.lineTo(lines[i][j].x, lines[i][j].y);
  }

  context.stroke();
}
{{< / highlight >}}
</div>

Amazing, we have lines on our canvas! Now, the next job we have is to displace them. We will do that up in our first loop, where we create the points. 

<div id="tmd-5" class="tmd-trigger" data-from="16" data-action="replace" data-to="17">
{{< highlight js "linenos=table,linenostart=0" >}}
    var random = Math.random() * 10;
    var point = {x: j, y: i + random};
{{< / highlight >}}
</div>

Ahh, there we have it. Our lines are now jumping all over the place, just as planned. The next step, is to get them to distort in the areas that we want. Namely, more distorted towards the center, and less towards the edges. We are going to do this with an absolute function.

<div id="tmd-5" class="tmd-trigger" data-from="16" data-action="replace" data-to="17">
{{< highlight js "linenos=table,linenostart=0" >}}
    var distanceToCenter = Math.abs(j - size / 2);
    var variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
    var random = Math.random() * variance / 2 * -1;
{{< / highlight >}}
</div>

#TODO: Explain the distance to center stuff + clean up

We can see here that we've made something a little messy. and that we can see through each line, which doesn't look great. We're going to use a `fill` to cover those up. First we'll set the fill style.

<div id="tmd-6" class="tmd-trigger" data-from="8" data-action="inject" data-to="8">
{{< highlight js "linenos=table,linenostart=0" >}}
context.fillStyle = '#f9f9f9';
context.lineWidth = 2;
{{< / highlight >}}
</div>

And then we will add in the fill command, after the line is drawn. This coveres up the messy lines beneath each layer.

<div id="tmd-7" class="tmd-trigger" data-from="36" data-action="inject" data-to="36">
{{< highlight js "linenos=table,linenostart=0" >}}
    context.fill();
{{< / highlight >}}
</div>

We're getting so close now. The only piece left is to make the lines much less jagged. To do this, we're going to use quadratic curves, and create control points between each one to create a smooth path. The final `quadraticCurveTo` is running the last joining step.

<div id="tmd-8" class="tmd-trigger" data-from="32" data-action="replace" data-to="35">
{{< highlight js "linenos=table,linenostart=0" >}}
    for( var j = 0; j < lines[i].length - 2; j++) {
      var xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
      var yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
      context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
    }
    
    context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);
{{< / highlight >}}
</div>

And there we have it! You can mess with the steps, and styles and colors for a bunch of different results, all are exciting!