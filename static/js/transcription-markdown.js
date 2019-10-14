// Version 0.1, lets get it working first

(function() {
	var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var interactiveMode;

	var currentTime = 0;
	var active = false;
	var currentActiveTime = null;

	var interactiveCheckbox = document.querySelector("#interactive");
	var audioElement = document.querySelector("audio");
	var tutorialContentParent = document.querySelector(".tutorial-content");
	var tutorialContent = document.querySelector(".tutorial-content-wrapper");

	// Checkbox can be turned off
	interactiveCheckbox.addEventListener("click", e => {
		interactiveMode = e.target.checked;
	});

	// Audio element reports its own updates
	audioElement.addEventListener("timeupdate", e => {
		currentTime = audioElement.currentTime;
		if (interactiveMode) checkUpdate();
	});

	prefersReducedMotion.addEventListener('change', () => {
		setInteractiveMode();
	});

	const nodeData = [];

	function setInteractiveMode() {
	// turns off interactive mode if user has preferences for prefers-reduced-motion
		interactiveMode = !prefersReducedMotion.matches;		
		interactiveCheckbox.checked = interactiveMode;
	}

	function getAndPrepTimes() {
		const nodes = document.querySelectorAll("[data-time]");
		nodes.forEach(node => {
			const times = node.getAttribute("data-time").split(":");
			const totalSeconds = parseInt(times[0]) * 60 + parseInt(times[1]);
			nodeData.push({
				time: totalSeconds,
				domNode: node
			});
		});
	}

	function checkUpdate() {
		const passedTimes = nodeData.filter(item => {
			return item.time < currentTime;
		});

		const currentItem = passedTimes[passedTimes.length - 1];

		if (
			currentItem &&
			currentActiveTime !== currentItem.time &&
			interactiveMode
		) {
			currentActiveTime = currentItem.time;
			currentItem.domNode.scrollIntoView({ behavior: "smooth" });
		}
	}

	setInteractiveMode();
	getAndPrepTimes();
})();
