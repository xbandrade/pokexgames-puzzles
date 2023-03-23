const MAX_MISSES = 6;
const MAX_SKIPS = 8;
let index = 0;
let misses = 0;
let skips = 0;
let success = false;
let keyPressed = false;
let expectedKeys = [];
let imageText = document.querySelector('.image-text');
let image = document.querySelector('.image-container img');
let retryButton;

function updateKeyframes(element) {
    let styleSheet;
    for (let i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].href && document.styleSheets[i].href.endsWith('styles.css')) {
            styleSheet = document.styleSheets[i];
            break;
        }
    }
    if (!styleSheet) {
        console.error('Could not find styles.css stylesheet');
        return;
    }
	let keyframeName = 'blink-and-move-up';
    let keyframesRule;

	for (let i = styleSheet.cssRules.length -1; i >= 0; i--) {
		if (styleSheet.cssRules[i] instanceof CSSKeyframesRule && styleSheet.cssRules[i].name === keyframeName) {
			keyframesRule = styleSheet.cssRules[i];
			break;
		}
	}

    if (keyframesRule) {
        keyframesRule.deleteRule('0%');
        keyframesRule.deleteRule('24%');
        keyframesRule.deleteRule('100%');

        let topStart = parseInt(element.style.top);
        let topEnd = topStart - 10;

        keyframesRule.appendRule(`0% { opacity: .8; top: ${topStart}%; }`);
        keyframesRule.appendRule(`24% { opacity: 0; top: ${topEnd}%; }`);
        keyframesRule.appendRule(`100% { opacity: 0; top: ${topEnd}%; }`);
    }
}


let originalFontSize = parseInt(window.getComputedStyle(imageText).fontSize);
let positions = [
	[10, 47],
	[25, 20],
	[25, 73],
	[62, 13],
	[62, 79],
	[88, 60],
	[88, 33],
]
let delay = [
	650, 650, 700, 
	1500, 1500, 600, 3000, 
	1400, 1200, 1200, 3300,
	1800, 1500, 1000, 2400,
	1500, 1500, 1500, 3400,
	600, 1200, 1200, 1000, 1000, 3400, 
	1100, 1100, 1100, 1700, 400, 400, 3400, 
	1100, 1100, 1100, 1000, 400, 1100, 3000, 
	1100, 1100, 1100, 1100, 400, 3400, 
	1100, 1100, 1100, 1100, 1100, 3000, 
	1100, 1100,
]

let keysMap = {
	'A': ['a', 'A'],
	'B': ['b', 'B'],
	'C': ['c', 'C'],
	'D': ['d', 'D'],
	'E': ['e', 'E'],
	'F': ['f', 'F'],
	'G': ['g', 'G'],
	'A#': ['a', 'A', '#'],
	'C#': ['c', 'C', '#'],
	'D#': ['d', 'D', '#'],
	'F#': ['f', 'F', '#'],
	'G#': ['g', 'G', '#']
}

let originalBackgroundColor = document.body.style.backgroundColor;
let recursiveTimeout;
let promiseTimeout;
let timeoutID;

function updateImageText() {
	console.log(misses, skips);
	if (index == 100 || skips > MAX_SKIPS || misses > MAX_MISSES) {
		console.log('MAX SKIPS OR MAX MISSES REACHED!');
		console.log('Stopping music!');
		const audioElement = document.querySelector('#audio-element');
		audioElement.pause();
		let fluteResults = document.querySelector('.flute-results');
		fluteResults.innerHTML =  `Fail!<br>Skips: ${skips}<br>Misses: ${misses}`;
		fluteResults.style.display = 'block';
		document.body.style.backgroundColor = '#F67280';
		imageText.style.top = '-200%';
		imageText.style.left = '-200%';
		imageText.innerHTML = '';
		image.classList.add('blur');
		retryButton.style.display = 'block';
		return;
	}
	if (index < window.notes.length) {   
		let currDelay = delay[index]; 
		if (index > 2) {
			let pillar = positions[Math.floor(Math.random() * positions.length)];
			imageText.style.top = pillar[0] + '%';
			imageText.style.left = pillar[1] + '%';
			imageText.style.fontSize = originalFontSize + 'px';
			updateKeyframes(imageText);
			imageText.classList.remove('image-text');
			void imageText.offsetWidth;
			imageText.classList.add('image-text');
			imageText.innerHTML = window.notes[index];
			keyPressed = false;
			expectedKeys = keysMap[window.notes[index]];
			const keyPressPromise = new Promise((resolve, reject) => {
				const handleKeyPress = (event) => {
					keyPressed = true;
					if (expectedKeys.includes('#')) {
						if (event.shiftKey && expectedKeys.includes(event.key)) {
							document.body.style.backgroundColor = '#80CEE1';
						} else {
							document.body.style.backgroundColor = '#F67280';
							misses++;
						}
					} else {
						if (!event.shiftKey && expectedKeys.includes(event.key)) {
							document.body.style.backgroundColor = '#80CEE1';
						} else {
							document.body.style.backgroundColor = '#F67280';
							misses++;
						}
					}
					document.removeEventListener('keypress', handleKeyPress);
					resolve();
				};
				document.addEventListener('keypress', handleKeyPress);
				promiseTimeout = setTimeout(() => {
					document.removeEventListener('keypress', handleKeyPress);
					reject(new Error('Timeout'));
				}, Math.min(1000, currDelay));
			});
				
			keyPressPromise
			.then(() => {
				console.log('Key pressed');
				timeoutID = setTimeout(() => {
					if (index < window.notes.length && skips <= MAX_SKIPS && misses <= MAX_MISSES){
						document.body.style.backgroundColor = originalBackgroundColor;
					}
				}, 400);
			})
			.catch((error) => {
				console.log(error.message);
				skips++;
			})
			.finally(() => {
				if (skips > MAX_SKIPS || misses > MAX_MISSES){
					index = 100;
					clearTimeout(recursiveTimeout);
					clearTimeout(promiseTimeout);
					clearTimeout(timeoutID);
					setTimeout(updateImageText(), 1);
					return;
				}
			});
		} else {
			pillar = [35, 43];
			imageText.style.top = pillar[0] + '%';
			imageText.style.left = pillar[1] + '%';
			imageText.style.fontSize = (originalFontSize * 3) + 'px';
			updateKeyframes(imageText);
			imageText.classList.remove('image-text');
			void imageText.offsetWidth;
			imageText.classList.add('image-text');
			imageText.innerHTML = window.notes[index];
		}
		console.log('OK!', skips, misses);
		index++;
		recursiveTimeout = setTimeout(updateImageText, currDelay);
	} else {
		console.log('SUCCESS!');
		success = true;
		let fluteResults = document.querySelector('.flute-results');
		fluteResults.innerHTML =  `Success!<br>Skips: ${skips}<br>Misses: ${misses}`;
		fluteResults.style.display = 'block';
		document.body.style.backgroundColor = '#77DD77';
		image.src = successImageUrl;
		image.classList.add('blur');
		imageText.style.top = '-200%';
		imageText.style.left = '-200%';
		imageText.innerHTML = '';
		retryButton.style.display = 'block';
	}
}


document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('#play-button');
	const audioElement = document.querySelector('#audio-element');
	retryButton = document.querySelector('#retry-button');
    playButton.addEventListener('click', () => {
        playButton.style.display = 'none';
        audioElement.play();
        updateImageText();
    });
});