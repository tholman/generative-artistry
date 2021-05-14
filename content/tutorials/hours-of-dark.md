+++
title = "Hours of Dark"
date = 2021-05-13T10:24:00-04:00
image = "/img/09-hours-of-dark.png"
iama = "tutorial"
teaser = "365 strokes representing the hours of darkness of each day. A recreation of the 2011 calendar by Accept & Proceed."
+++

# Hours of Dark

<p class="tutorial-contributor">
This post is from the talented <a href="https://brunoimbrizi.com/">brunoimbrizi</a>, if you're interested in posting, you can open up a <a href="https://github.com/tholman/generative-artistry/issues/31">proposal</a>, just like he did!
</p>

In this tutorial, we are going to recreate the look of a print by Accept & Proceed called <a href="https://acceptandproceed.com/shop/HOD11" target="_blank">Hours of Dark 2011</a>. All the strokes in the grid represent a day, their width proportional to the hours of darkness and their orientation defined by the angle of the sunset.

Here is our initial setup with a single `<canvas>` element, using `window.devicePixelRatio` to scale it on retina screens.

<div class="tmd-trigger" data-from="0">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;
var dpr = window.devicePixelRatio;
canvas.width = size * dpr;
canvas.height = size * dpr;
context.scale(dpr, dpr);
{{< / highlight >}}
</div>

We need a few variables to describe the grid. First, the number of strokes which is the same as the number of days in a non-leap year. Then the number of columns and rows, just enough to pack 365 cells in the grid. In this case 23&times;16 = 368, so the last 3 cells will be blank.

<div class="tmd-trigger" data-from="10">
{{< highlight js "linenos=table,linenostart=10" >}}
var cols = 23;
var rows = 16;
var days = 365;
{{< / highlight >}}
</div>

We also need variables to define the dimensions of the grid, which has a landscape aspect. And from that we can calculate the dimensions of each cell and the top and left margins.

<div class="tmd-trigger" data-from="14">
{{< highlight js "linenos=table,linenostart=14" >}}
var gridw = size * 0.9;
var gridh = size * 0.7;
var cellw = gridw / cols;
var cellh = gridh / rows;
var margx = (size - gridw) * 0.5;
var margy = (size - gridh) * 0.5;
{{< / highlight >}}
</div>

Now we have enough to start drawing the strokes. We are going to loop over `days` column by column, so first, all the rows in the first column, then all the rows in the second column and so on. 

`x` and `y` depend on the margins and on the cell dimensions. The width and height of each stroke (`w`, `h`) are arbitrary values which look right for the size of our canvas on the page. The rectangles are drawn from the centre, so this will be their anchor point when we rotate them later.

<div class="tmd-trigger" data-from="21">
{{< highlight js "linenos=table,linenostart=21" >}}
for (let i = 0; i < days; i++) {
  var col = Math.floor(i / rows);
  var row = i % rows;

  var x = margx + col * cellw;
  var y = margy + row * cellh;
  var w = 2;
  var h = 30;
  
  context.save();
  context.translate(x, y);

  context.beginPath();
  context.rect(w * -0.5, h * -0.5, w, h);
  context.fill();

  context.restore();
}
{{< / highlight >}}
</div>

At this point, the grid is a bit offset to the left and to the top, and this is because `x` and `y` are the top-left of each cell. So we need one more call to `translate` to place the origin at the centre of the cell. These separate calls will come in handy later.

<div class="tmd-trigger" data-from="32" data-to="32" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=32" >}}
context.translate(cellw * 0.5, cellh * 0.5);
{{< / highlight >}}
</div>

Now we need to calculate the rotation. In the original calendar, the authors used data from the angle of the sunset (known as the Azimuth) to determine the orientation of the lines. Luckily for us, we can get pretty close with a sine curve, thanks to the smooth wobble of our planet.

The trick here is to use two angles.

The first one `phi` determines the range of rotation in a year, which is between 0 and &Pi;.

The second one `theta` modulates the first one with a sine curve, so instead of rotating a full 180&deg;, it eases in and out of the first half of that angle and then eases back into 0&deg;.

<div class="tmd-trigger" data-from="34" data-to="34" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=34" >}}
var phi = (i / days) * Math.PI;
var theta = Math.sin(phi) * Math.PI * 0.5;

context.rotate(theta);
 
{{< / highlight >}}
</div>

To match the look, we need to nudge the inital angle. We also need to adjust the rotation range so it's a little bit less than 90&deg;.

<div class="tmd-trigger" data-from="35" data-to="36" data-action="replace" data-indent="1">
{{< highlight js "linenos=table,linenostart=35" >}}
var theta = Math.sin(phi) * Math.PI * 0.45 + 0.85;
{{< / highlight >}}
</div>

The thickness of the strokes is proportional to the hours of darkness in each day. Again, we can get away with a good approximation using a cosine curve.

<div class="tmd-trigger" data-from="39" data-to="39" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=39" >}}
var scale = Math.abs(Math.cos(phi)) * 2 + 1;

context.scale(scale, 1);
 
{{< / highlight >}}
</div>

The last step is to apply a clipping mask so each stroke is only drawn inside its cell. This is where our separate calls to `translate` come in handy, so we need to insert the next chunk of code in between those calls.

<div class="tmd-trigger" data-from="32" data-to="32" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=32" >}}
 
context.beginPath();
context.rect(0, 0, cellw, cellh);
context.clip();
 
{{< / highlight >}}
</div>

And there we have it! Simple and elegant. A beautiful piece of data visualisation from <a href="https://acceptandproceed.com/shop/HOD11" target="_blank">Accept &amp; Proceed</a> which we managed to recreate with some sine and cosine curves.
