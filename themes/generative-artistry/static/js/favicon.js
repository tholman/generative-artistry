(function () {
  // Create canvas & context
  var canvas = document.createElement('canvas')
  var size = 20
  canvas.height = canvas.width = size
  var context = canvas.getContext('2d')
  
  // Favicon element
  var link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'

  // Loop through and draw random diagonals
  var step = 4
  for( var x = 0; x < size; x += step) {
    for( var y = 0; y < size; y+= step ) {
      var leftToRight = Math.random() >= 0.5

      if( leftToRight ) {
        context.moveTo(x, y)
        context.lineTo(x + step, y + step)
      } else {
        context.moveTo(x + step, y)
        context.lineTo(x, y + step)
      }

      context.stroke()
    }
  }

  // Save to favicon and append to page
  link.href = canvas.toDataURL('image/png')
  document.head.appendChild(link)
})();