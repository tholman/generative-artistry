+++
title = "Circle Packing"
date = 2018-07-19T09:59:00-04:00
number = "06"
image = "/img/06-circle-packing.png"
teaser = "Packing circles into a tight space gives a beautiful effect, and it's not nearly as complex as it looks!"
+++

# Circle Packing

Circle packing is such a fantastic effect, it looks infinitely complex, while also being mathematically beautiful. In this tutorial, we're going to create a circle packing effect... Interestingly, this is a good example of an effect that isn't particularly efficient to run, but at the same time, will still be very quick! 

As usual, we're going to begin with a small, clean canvas.

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

Now, I'm going to explain a little about our process, so we know which variables we will need. You'll be able to see here that it's not the most efficient, but it really gets the job done.

Our steps will be: 

1. Create a new `Circle`
1. Check to see if the circle collides with any other circles we have.
1. If it doesn't collide, we will grow it slightly, and then check again if it collides.
1. Repeat these steps until we have a collision, or we reach a "max size"
1. Create another circle and repeat `x` times.

So, we have an array of `circles`, a `totalCircles`, a min & max `circleSize` and a `createCircleAttempts`. Let's get this in code.

<div class="tmd-trigger" data-from="12">
{{< highlight js "linenos=table,linenostart=12" >}}
var circles = [];
var minRadius = 2;
var maxRadius = 100;
var totalCircles = 500;
var createCircleAttempts = 500;
 
{{< / highlight >}}
</div>

Now we will spec out our process. We will make a `createCircle` and `doesCircleHaveACollision` function, and then fill it in with our goals... including calling the `createAndDrawCircle` function once for each of our `totalCircles` variable.

<div class="tmd-trigger" data-from="18">
{{< highlight js "linenos=table,linenostart=18" >}}
function createAndDrawCircle() {
  
  // Loop through from 0 to createCircleAttempts
  // trying to create a circle.

  // Once we have a circle created, grow it until
  // it hits another, or reaches max size.

  // Draw the circle
}

function doesCircleHaveACollision(circle) {
  // Return true of false depending on whether the circle collides with another.

  // but return false for now
  return false;
}

for( var i = 0; i < totalCircles; i++ ) {  
  createAndDrawCircle();
}
{{< / highlight >}}
</div>

This is the fun part, we can go through our functions and fill them in. If we tackle this in a step by step way, it will flow out really well.

First, we'll start with creating a circle object, we'll give it an `x`, `y` and a `radius`

<div class="tmd-trigger" data-from="20" data-to="22">
{{< highlight js "linenos=table,linenostart=21" >}}
  var newCircle = {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size),
    radius: minRadius
  };
{{< / highlight >}}
</div>

Now, we'll add it to our list of circles, and draw it... we didn't really need to do this just yet, but being able to see what we're coding render out really helps with the process.

<div class="tmd-trigger" data-from="29" data-to="30">
{{< highlight js "linenos=table,linenostart=29" >}}
  circles.push(newCircle);
  context.beginPath();
  context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2*Math.PI);
  context.stroke(); 
{{< / highlight >}}
</div>

Awesome, and there we have it, tiny circles all over our screen. Next, we can look at growing them. We will do this 1 unit at a time, and when they collide, we'll take one step back, and break out of the loop.

<div class="tmd-trigger" data-from="26" data-to="28">
{{< highlight js "linenos=table,linenostart=26" >}}
  for(var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize;
    if(doesCircleHaveACollision(newCircle)){
      newCircle.radius--
      break;
    } 
  }
{{< / highlight >}}
</div>

Wow, what a mess we've made! Of course we know the reason for this. Currently our `doesCircleHaveACollision` function always returns `false` ... we'll need to fill that in.

The way that we tell if circles have a collision, is a little bit of trigonometry. We're going to loop through each of the circles that are drawn and compare them to the current circle being drawn. If their radii combined, is greater than the distance between each of their centers, then we know there's a collision.

To get the distance between the two center points, we will use `pythagoras' theorem` (whoa, that high school math coming in handy!)

<div class="tmd-trigger" data-from="41" data-to="44">
{{< highlight js "linenos=table,linenostart=40" >}}
  for(var i = 0; i < circles.length; i++) {
    var otherCircle = circles[i];
    var a = circle.radius + otherCircle.radius;
    var x = circle.x - otherCircle.x;
    var y = circle.y - otherCircle.y;

    if (a >= Math.sqrt((x*x) + (y*y))) {
      return true;
    }
  }
  
{{< / highlight >}}
</div>

Almost there! But another small gotcha, when we're creating our circles, there's also a chance that they're appearing *inside* others.

We're going to use a loop in the creation area now as well, its a little inefficient to randomly guess positions, but really at the end of the day, unless we were doing millions of circles, we won't see any slow down.

If the circle doesn't find a safe place to draw, the attempt is abandoned.

<div class="tmd-trigger" data-from="20" data-to="25">
{{< highlight js "linenos=table,linenostart=20" >}}
  var newCircle;
  var circleSafeToDraw = false;
  for( var tries = 0; tries < createCircleAttempts; tries++) {
    newCircle = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      radius: minRadius
    }
    
    if(doesCircleHaveACollision(newCircle)) {
      continue;
    } else {
      circleSafeToDraw = true;
      break;
    }
  }

  if(!circleSafeToDraw) {
    return;
  }

{{< / highlight >}}
</div>

Wow, now we've got some beautiful circles, all packed in! There's only one little step more to do, and that is to trigger a collision when they hit the wall as well as each other. We'll break that into two if statements, one checking the top and bottom, and one checking the left and right.

<div class="tmd-trigger" data-from="67" data-to="67">
{{< highlight js "linenos=table,linenostart=66" >}}

  if ( circle.x + circle.radius >= size ||
     circle.x - circle.radius <= 0 ) {
    return true;
  }
    
  if (circle.y + circle.radius >= size ||
      circle.y - circle.radius <= 0 ) {
    return true;
  }
  
{{< / highlight >}}
</div>

And there we have it! It's not the prettiest code, but it's a great example of how some complex things can be reasoned out, thought about, and stepped through with relative ease & a little math.
