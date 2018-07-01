+++
title = "Triangle Mesh"
date = 2018-06-28T10:24:00-04:00
number = "04"
image = "/img/04-triangle-mesh.png"
teaser = "Triangle meshs are the fundations of 3d modeling, building one doesn't require trigonometry crazyness."
+++

# Triangle mesh

<p class="tutorial-contributor">
This post is from the talented <a href="https://maxwellito.com/">maxwellito</a>, if you're interested in posting, you can open up a <a href="https://github.com/tholman/generative-artistry/issues/6">proposal</a>, just like he did!
</p>

This effect triangular meshing effect is often shown off in libraries and shown off with SVG, today we're going to build it with the canvas! Its a great example of how a coordinate system, and a little displacement can give clean beautiful effects.

As usual we begin with a little setup code, a square canvas. 

<div class="tmd-trigger" data-from="0" data-action="replace" data-to="all">
{{< highlight js "linenos=table,linenostart=1" >}}
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var size = window.innerWidth;

canvas.width = size;
canvas.height = size;
  
{{< / highlight >}}
</div>

Now let's make a grid of dots. The standard way, regular lines and columns. For every dot coordinate we will draw it on the canvas but also store the coordinate in an array for future use.

Every coordinate will be represented by an object with 2 properties: `x` and `y`.

The space between lines and columns is defined by the variable `gap`, we'll draw these circles so we can see how our grid is placed out on the canvas.

<div class="tmd-trigger" data-from="10" data-action="inject" data-to="10">
{{< highlight js "linenos=table,linenostart=9" >}}
var line,
    lines = [],
    gap = size / 7;

for (var y = gap / 2; y <= size; y+= gap) {
  line = []
  for (var x = gap / 2; x <= size; x+= gap) {
    line.push({x: x, y: y})
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  }
  lines.push(line)
}
  
{{< / highlight >}}
</div>

Now, we're going to displace every second line on the x axis. We do this by alternating the a variable called `odd` between true and false.

We can see that the new pattern is shaping up to be a mesh of regular triangles.

<div class="tmd-trigger" data-from="8" data-action="replace" data-to="23">
{{< highlight js "linenos=table,linenostart=9" >}}
var line, dot,
    odd = false, 
    lines = [],
    gap = size / 8;

for (var y = gap / 2; y <= size; y+= gap) {
  odd = !odd
  line = []
  for (var x = gap / 4; x <= size; x+= gap) {
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

To make our life easier let's make a function that take the 3 coordinates of a triangle and draw them together.

<div class="tmd-trigger" data-from="26" data-action="inject" data-to="26">
{{< highlight js "linenos=table,linenostart=26" >}}
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

Now we'll string up our `drawTriangle` function, and use the dots we generated earlier to draw all the triangles.

This part might be a bit complex to understand. The script is going to go through all the lines and combining the two dots of the sibling line, forming triangles. The concatenation of two lines, let's say line `a` and line `b`, and merge the dots into one array to make it look like a zig-zag: `a1`, `b1`, `a2`, `b2`, `a3` etc. 

This will give us an array, containing each triangles specific coordinates. Looking something like [`a1`, `b1`, `a2`], [`b1`, `a2`, `b2`], [`a2`, `b2`, `a3`]...

<div class="tmd-trigger" data-from="36" data-action="inject" data-to="36">
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

Every dot is a `gap` away from the surrounding dots. So a dot can be moved in this area without overlapping with other dots. Let's use a bit of `Math.random()` to add get a random position in this area.

<div class="tmd-trigger" data-from="17" data-action="replace" data-to="22">
{{< highlight js "linenos=table,linenostart=16" >}}
    line.push({
      x: x + (Math.random()*.8 - .4) * gap  + (odd ? gap/2 : 0),
      y: y + (Math.random()*.8 - .4) * gap,
    })
{{< / highlight >}}
</div>

And for a little extra generative fun, lets add in some grays! Only 16 shades. No more.

<div class="tmd-trigger" data-from="32" data-action="inject" data-to="32">
{{< highlight js "linenos=table,linenostart=30" >}}
  var gray = Math.floor(Math.random()*16).toString(16);
  context.fillStyle = '#' + gray + gray + gray; 
  context.fill();
{{< / highlight >}}
</div>

If you're interested in exploring more detailed implementations of this effect, you can check out my library: [triangulr](http://maxwellito.github.io/triangulr/)

