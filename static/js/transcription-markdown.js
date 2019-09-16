// Version 0.1, lets get it working first
// data is currently stored in a json blob.

(function() {

	var interactiveMode = true
	var currentTime = 0
	var active = false

	var interactiveCheckbox = document.querySelector('#interactive');
	var audioElement = document.querySelector('audio')
	var tutorialContentParent = document.querySelector('.tutorial-content')
	var tutorialContent = document.querySelector('.tutorial-content-wrapper')
	var current = null

	// Checkbox can be turned off
	interactiveCheckbox.addEventListener('click', (e) => {
		interactiveMode = e.target.value
	})

	// Audio element reports its own updates
	audioElement.addEventListener('timeupdate', (e) => {
		currentTime = audioElement.currentTime

		if( active === false && interactiveMode === true ) {
			active = true;
			replaceCurrent()
		}

		checkUpdate()
	})

	function checkUpdate() {


	  //  Can obv be less messy
	  const passedTimes = timingData.filter(item => {
	    return item.time < currentTime;
	  });

	  const currentItem = passedTimes[passedTimes.length - 1];


	  if (inner.innerHTML !== currentItem.text) {
	    inner.innerHTML = currentItem.text;
	    inner.className = 'who ' + currentItem.who
	  }

	}


	var inner
	var newCurrent

	function replaceCurrent() {
		tutorialContentParent.removeChild(tutorialContent)

		newCurrent = document.createElement('div')
		newCurrent.className = 'rich-content'

		inner = document.createElement('div')
		inner.className = 'who'

		newCurrent.appendChild(inner)

		tutorialContentParent.appendChild(newCurrent)
	}



})()