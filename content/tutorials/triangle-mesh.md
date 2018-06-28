+++
title = "Triangle Mesh"
date = 2018-06-28T10:24:00-04:00
number = "04"
image = "/img/04-triangle-mesh.png"
teaser = "Triangle meshs are the fundations of 3d modeling, building one doesn't require trigonometry crazyness."
+++


# Triangle mesh




Let's start by creating a blank canvas

<div id="tmd-1" class="tmd-trigger" data-from="0" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;

var gap = 80;
{{< / highlight >}}
</div>


Now let's make a grid of dots. We gonna generate every dots in separate array, each one will represent a line.

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="inject" data-to="12">
{{< highlight js "linenos=table,linenostart=1" >}}
var line,
    lines = []

for (var y = 0; y < size; y+= gap) {
  line = []
  for (var x = 0; x < size; x+= gap) {
    line.push({x, y})
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  }
  lines.push(line)
}
{{< / highlight >}}
</div>

Then use the data we generated to display dots

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="replace" data-to="25">
{{< highlight js "linenos=table,linenostart=1" >}}
var line, odd,
    lines = []

for (var y = 0; y < size; y+= gap) {
  odd = !odd
  line = []
  for (var x = odd ? gap/2 : 0; x < size; x+= gap) {
    line.push({x, y})
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  }
  lines.push(line)
}
{{< / highlight >}}
</div>

Now we have the data about the dots, we have to go through all of them to generate the connection between them.





Let's build a function to draw triangles from 3 data points.

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="inject" data-to="12">
{{< highlight js "linenos=table,linenostart=1" >}}
function drawTriangle(pointA, pointB, pointC) {
  context.beginPath();
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);
  context.lineTo(pointC.x, pointC.y);
  context.lineTo(pointA.x, pointA.y);
  context.closePath();
  context.stroke();
}
{{< / highlight >}}
</div>


Then use the dots we generated earlier to draw all the triangles.

This part might be a bit complex to understand. The script gonna through all the line and combine the dots of 2 lines. The concatenation make it look like a zig-zap: a1, b1, a2, b2, a3... 

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="inject" data-to="12">
{{< highlight js "linenos=table,linenostart=1" >}}
var dotLine
odd = true
for (var y = 0; y < lines.length - 1; y++) {
  odd = !odd
  dotLine = []
  for (var i = 0; i < lines[y].length; i++) {
    dotLine.push(odd ? lines[y][i] : lines[y+1][i])
    dotLine.push(odd ? lines[y+1][i] : lines[y][i])
  }
  for (var i = 0; i < dotLine.length - 2; i++) {
    drawTriangle(...dotLine.slice(i, i+3))
  }
}
{{< / highlight >}}
</div>



And now: LET'S MAKE THE MAGIC HAPPEN

<div id="tmd-2" class="tmd-trigger" data-from="12" data-action="inject" data-to="12">
{{< highlight js "linenos=table,linenostart=1" >}}
line.push({
  x: x + (Math.random()*.5 - .25) * gap,
  y: y + (Math.random()*.5 - .25) * gap,
})
{{< / highlight >}}
</div>
