+++
title = "Triangle Mesh"
date = 2018-06-28T10:24:00-04:00
number = "04"
image = "/img/04-triangle-mesh.png"
teaser = "Triangle meshs are the fundations of 3d modeling, building one doesn't require trigonometry crazyness."
+++


# Triangle mesh


This effect has been declined to a lot of libraries and scripts based on D3.

The following tutorial will take place on a square canvas.

<div id="tmd-1" class="tmd-trigger" data-from="0" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;

{{< / highlight >}}
</div>


Now let's make a grid of dots. The standard way, regular lines and columns. For every dot coordinate we will draw it on the canvas but also store the coordinate in a 2 dimensions array for future use.

Every coordinate in this tutorial will be represented by an object with 2 properties: `x` and `y`.

The space between lines and columns is defined by the variable `gap`.

<div id="tmd-2" class="tmd-trigger" data-from="10" data-action="inject" data-to="10">
{{< highlight js "linenos=table,linenostart=9" >}}
var line,
    lines = [],
    gap = 50;

for (var y = 0; y < size; y+= gap) {
  line = []
  for (var x = 0; x < size; x+= gap) {
    line.push({x: x, y: y})
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  }
  lines.push(line)
}
{{< / highlight >}}
</div>

Now, we gonna move one out of two line on the x axis to an offset of half a gap. We can observe the new pattern is shaping a mesh of regular triangles.

<div id="tmd-2" class="tmd-trigger" data-from="8" data-action="replace" data-to="23">
{{< highlight js "linenos=table,linenostart=9" >}}
var line, dot,
    odd = false, 
    lines = []

for (var y = 0; y < size; y+= gap) {
  odd = !odd
  line = []
  for (var x = 0; x < size; x+= gap) {
    dot = {x: x + (odd ? gap/2 : 0), y: y}
    line.push(dot)
    context.beginPath();
    context.arc(dot.x, dot.y, 1, 0, 2 * Math.PI, true);
    context.fill();
  }
  lines.push(line)
}
{{< / highlight >}}
</div>


The next step will be using the dots to draw the triangles. 

To make our life easier let's make a function that take the 3 coordinates of a triangle and draw it for us.

<div id="tmd-3" class="tmd-trigger" data-from="24" data-action="inject" data-to="24">
{{< highlight js "linenos=table,linenostart=24" >}}
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

This part might be a bit complex to understand. The script gonna through all the lines and combine the dots of 2 sibling lines. The concatenation of two lines, let's say line `a` and line `b`, marge the dots into one array to make it look like a zig-zap: `a1`, `b1`, `a2`, `b2`, `a3`... 

From this concatenation, we gonna keep moving a window of 3 coordinates till the end of it. It should look like [`a1`, `b1`, `a2`], [`b1`, `a2`, `b2`], [`a2`, `b2`, `a3`]...  Each bloc represent a triangle to draw.

However, there's an important detail. While concatenating, the first dot must be the one the most on the left of the canvas. In our case, the first dot will always be the one from even lines.

<div id="tmd-4" class="tmd-trigger" data-from="33" data-action="inject" data-to="33">
{{< highlight js "linenos=table,linenostart=33" >}}
var dotLine;
odd = true;

for (var y = 0; y < lines.length - 1; y++) {
  odd = !odd
  dotLine = []
  for (var i = 0; i < lines[y].length; i++) {
    dotLine.push(odd ? lines[y][i]   : lines[y+1][i])
    dotLine.push(odd ? lines[y+1][i] : lines[y][i])
  }
  for (var i = 0; i < dotLine.length - 2; i++) {
    drawTriangle(dotLine[i], dotLine[i+1], dotLine[i+2])
  }
}
{{< / highlight >}}
</div>

We have a now a regular triangle mesh, we are one detail away to let the magic happen.

Every dot is a `gap` away from dots around. So a dot can be moved in this area without overlapping with other dots. Let's use a bit of `Math.random()` to add get a random position in this area. To make it look better, the following code is restricting the area to 80% of it. 

<div id="tmd-5" class="tmd-trigger" data-from="16" data-action="replace" data-to="20">
{{< highlight js "linenos=table,linenostart=16" >}}
line.push({
  x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
  y: y + (Math.random()*.8 - .4) * gap,
})
{{< / highlight >}}
</div>


Extra bonus: let's add a bit of gray. Only 16 shades. No more.

<div id="tmd-6" class="tmd-trigger" data-from="31" data-action="inject" data-to="31">
{{< highlight js "linenos=table,linenostart=30" >}}
var gray = Math.floor(Math.random()*16).toString(16);
context.fillStyle = '#' + gray + gray + gray; 
context.fill();
{{< / highlight >}}
</div>