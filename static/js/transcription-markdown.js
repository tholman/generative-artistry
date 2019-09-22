// Version 0.1, lets get it working first
// data is currently stored in a json blob.

(function() {
	var interactiveMode = true;
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
		console.log(interactiveMode);
	});

	// Audio element reports its own updates
	audioElement.addEventListener("timeupdate", e => {
		currentTime = audioElement.currentTime;
		if (interactiveMode) checkUpdate();
	});

	const nodeData = [];
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

		console.log(currentItem);
	}

	getAndPrepTimes();
})();
