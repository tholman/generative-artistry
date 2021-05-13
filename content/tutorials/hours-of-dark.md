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

Lorem ipsum sit dolor amet

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

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="10">
{{< highlight js "linenos=table,linenostart=10" >}}
var cols = 23;
var rows = 16;
var days = 365;
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="14">
{{< highlight js "linenos=table,linenostart=14" >}}
var gridw = canvas.width  * 0.85;
var gridh = canvas.height * 0.6;
var cellw = gridw / cols;
var cellh = gridh / rows;
var margx = (canvas.width  - gridw) * 0.5;
var margy = (canvas.height - gridh) * 0.5;
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="21">
{{< highlight js "linenos=table,linenostart=24" >}}
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

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="32" data-to="32" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=32" >}}
context.translate(cellw * 0.5, cellh * 0.5);
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="34" data-to="34" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=34" >}}
var phi = (i / days) * Math.PI;
var theta = Math.sin(phi) * Math.PI;

context.rotate(theta);
 
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="35" data-to="36" data-action="replace" data-indent="1">
{{< highlight js "linenos=table,linenostart=35" >}}
var theta = Math.sin(phi) * Math.PI * 0.45 + 0.85;
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="39" data-to="39" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=39" >}}
var scale = Math.abs(Math.cos(phi)) * 2 + 1;

context.scale(scale, 1);
 
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet

<div class="tmd-trigger" data-from="32" data-to="32" data-action="inject" data-indent="1">
{{< highlight js "linenos=table,linenostart=32" >}}
 
context.beginPath();
context.rect(0, 0, cellw, cellh);
context.clip();
 
{{< / highlight >}}
</div>

Lorem ipsum sit dolor amet
