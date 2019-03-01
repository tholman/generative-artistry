+++
title = "Joy Division"
date = 2018-05-04T09:59:00-04:00
image = "/img/02-joy-division.png"
iama = "tutorial"
teaser = "We've all seen this album cover in one form or another. Come and see how we can make a simple version of it."
+++

# Joy Division

The Joy Division album cover has a [cool history](https://blogs.scientificamerican.com/sa-visual/pop-culture-pulsar-origin-story-of-joy-division-s-unknown-pleasures-album-cover-video/), and is a beautiful example of data driven art. In this tutorial we're going to recreate it in a more simplistic form.

We're going to do this with the JavaScript canvas. No extra APIs. The only HTML we have on the page is a `<canvas>` element at 320&times;320 pixels.

Let's kick things off with some initial setup. You're not going to see anything render here, because these are the primary lines to setting up the canvas and context which we use to draw. We will also set the size of the canvas and adjust it based on the user's device pixel ratio, or pixel density. This ensures that the final result is crisp on all monitors.

<div class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);
context.lineWidth = 2;
{{< / highlight >}}
</div>

This gives us access to the `context` which allows us to draw on the page. 

Our initial plan of attack here is to create the lines on the canvas, which will be a series of points. From there, we will start to displace the points randomly to give us the effect we desire.

Let's get some base variables in here: `step`, which will be the steps in pixels between our points, and an array called `lines`, which is going to hold our lines.

<div class="tmd-trigger" data-from="11">
{{< highlight js "linenos=table,linenostart=11" >}}
var step = 10;
var lines = [];
{{< / highlight >}}
</div>

Now we'll write a function to prepare our lines. A line will consist of a series of points with `x` and `y` properties.

<div class="tmd-trigger" data-from="14">
{{< highlight js "linenos=table,linenostart=14" >}}
// Create the lines
for(var i = step; i <= size - step; i += step) {
    
  var line = [];
  for(var j = step; j <= size - step; j+= step) {
    var point = {x: j, y: i};
    line.push(point);
  } 
  lines.push(line);
}
{{< / highlight >}}
</div>

Our next step will be to draw these lines. Again, we'll start simple to get something on the page, and we will expand on it later.

<div class="tmd-trigger" data-from="25">
{{< highlight js "linenos=table,linenostart=25" >}}
// Do the drawing
for(var i = 0; i < lines.length; i++) {

  context.beginPath();
  context.moveTo(lines[i][0].x, lines[i][0].y);
  
  for(var j = 0; j < lines[i].length; j++) {
    context.lineTo(lines[i][j].x, lines[i][j].y);
  }

  context.stroke();
}
{{< / highlight >}}
</div>

Amazing, we have lines on our canvas! Now, the next job we have is to displace them. We will do that up in our first loop, where we create the points. 

<div id="tmd-5" class="tmd-trigger" data-from="19" data-to="20" data-indent="2">
{{< highlight js "linenos=table,linenostart=19" >}}
var random = Math.random() * 10;
var point = {x: j, y: i + random};
{{< / highlight >}}
</div>

Ahh, there we have it. Our lines are now jumping all over the place, just as planned. The next step is to get them to distort in the areas that we want—namely, more distorted towards the center, and less towards the edges. We are going to do this with an absolute function.

<div class="tmd-trigger" data-from="19" data-to="20" data-indent="2">
{{< highlight js "linenos=table,linenostart=19" >}}
var distanceToCenter = Math.abs(j - size / 2);
var variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
var random = Math.random() * variance / 2 * -1;
{{< / highlight >}}
</div>

We can see here that we've made something a little messy and that we can see through each line, which doesn't look great. We're going to use a `fill` with a `globalCompositeOperation` of `destination-out` to fix this.

Global composite operations allow us to draw to the canvas in very interesting ways. For our case, we want to essentially "erase" our new shape from the existing lines above it. The `destination-out` mode works great for erasing from a canvas. Check out [this article](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) to learn more about canvas global composite operations.

<div class="tmd-trigger" data-from="38" data-to="38">
{{< highlight js "linenos=table,linenostart=38" >}}
  context.save();
  context.globalCompositeOperation = 'destination-out';
  context.fill();
  context.restore();
{{< / highlight >}}
</div>

We're getting so close now. The only piece left is to make the lines much less jagged. To do this, we're going to use quadratic curves, and create control points between each one to create a smooth path. The final `quadraticCurveTo` is the last joining step.

<div class="tmd-trigger" data-from="34" data-to="38" data-indent="1">
{{< highlight js "linenos=table,linenostart=34" >}}
for(var j = 0; j < lines[i].length - 2; j++) {
  var xc = (lines[i][j].x + lines[i][j + 1].x) / 2;
  var yc = (lines[i][j].y + lines[i][j + 1].y) / 2;
  context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, xc, yc);
}

context.quadraticCurveTo(lines[i][j].x, lines[i][j].y, lines[i][j + 1].x, lines[i][j + 1].y);

{{< / highlight >}}
</div>

This looks great! Now we just need a little breathing room on top. Let's prevent the top lines from going off the top of the canvas. We can do this by starting the loop at a higher index to skip the drawing of a few of the top lines.

<div class="tmd-trigger" data-from="29" data-to="30">
{{< highlight js "linenos=table,linenostart=29" >}}
for(var i = 5; i < lines.length; i++) {
{{< / highlight >}}
</div>

And there we have it! You can mess with the steps, and styles and colors for a bunch of different results. All are exciting!
