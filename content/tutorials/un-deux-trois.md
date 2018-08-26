+++
title = "Un Deux Trois"
date = 2018-07-06T09:59:00-04:00
number = "05"
image = "/img/05-un-deux-trois.png"
teaser = "There's no real generative art showcase complete without something from Vera Molnár, one of earliest pioneers of digital art. "
+++

# Un Deux Trois

![Un Deux Trois](/img/05-un-deux-trois.png)

[Vera Molnár](https://en.wikipedia.org/wiki/Vera_Molnar) is a true inspiration to anyone interested in generative art. She is truly one of the very first people to be creating digital art, and one of the most compelling to follow. In this tutorial, we're going to reproduce one of her works, Un Deux Trois.

We're going to use a somewhat standard setup here, getting our canvas and context which we will use to draw. We will also set the size of the canvas and adjust it based on the user's device pixel ratio, or pixel density. This ensures that the final result is crisp on all monitors. 

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

Now, we're going to set a few variables to our context. The first two, are to make the lines we will draw much thicker. The second two are variables we're going to use to step through our canvas and draw our creation.

<div class="tmd-trigger" data-from="10">
{{< highlight js "linenos=table,linenostart=10" >}}
context.lineWidth = 4;
context.lineCap = 'round';

var step = 20;
var aThirdOfHeight = size/3;
  
{{< / highlight >}}
</div>

Now, we're going to create a draw function, which is going to accept an `x` & `y` coordinate, a `width` & `height`, and an array of `positions`. The positions will tell us where to draw specific lines. Here we have it.

<div class="tmd-trigger" data-from="16">
{{< highlight js "linenos=table,linenostart=16" >}}
function draw(x, y, width, height, positions) {
  context.save();
  context.translate(x, y);
  
  for(var i = 0; i <= positions.length; i++) {
    context.beginPath();
    context.moveTo(positions[i] * width, 0);
    context.lineTo(positions[i] * width, height);
    context.stroke();
  }

  context.restore();
}
  
{{< / highlight >}}
</div>

This is using `context.translate` to "move" the canvas to an x & y position, and then drawing lines in those coordinates based on the positions passed. So... let's pass something in.

<div class="tmd-trigger" data-from="30">
{{< highlight js "linenos=table,linenostart=30" >}}
for(var y = step; y < size - step; y += step) {
  for(var x = step; x < size - step; x+= step) {
    draw(x, y, step, step, [0.5]);      
  }
}
{{< / highlight >}}
</div>

So we can see now we're drawing a small line in the middle (`0.5`) of each square. If we're going to replicate Vera's work, we're going to want to get a little bit more complex than that, we're going to use the `aThirdOfHeight` variable we defined previously, to draw 2 and 3 lines in our squares, when we are a third and two thirds down the screen. 

<div class="tmd-trigger" data-from="32" data-to="33">
{{< highlight js "linenos=table,linenostart=30" >}}
    if(y < aThirdOfHeight) {
      draw(x, y, step, step, [0.5]);   
    } else if(y < aThirdOfHeight * 2) {
      draw(x, y, step, step, [0.2, 0.8]);      
    } else {
      draw(x, y, step, step, [0.1, 0.5, 0.9]);      
    }
{{< / highlight >}}
</div>

Awesome! Now we have increasing complexity as we go down the page, in the one, two, three pattern. All we need to do is add a little bit of random rotational magic and we're going to have a beautiful piece. We're going to add `context.rotate(Math.random() * 5);` to give us some random rotation, and alter our translates a little, to make sure they're rotating from the center of each square.

<div class="tmd-trigger" data-from="18" data-to="19">
{{< highlight js "linenos=table,linenostart=18" >}}
  context.translate(x + width/2, y + height/2);
  context.rotate(Math.random() * 5);
  context.translate(-width/2, -height/2);
{{< / highlight >}}
</div>

Beautiful. There we have it, Un Deux Trois. If you're looking to explore other ideas, you could try getting more complex with more than 3 lines. Or perhaps play around with adding some color, remember, the fun of generative art is adding more variance and surprise, until you catch yourself off guard with something beautiful.
