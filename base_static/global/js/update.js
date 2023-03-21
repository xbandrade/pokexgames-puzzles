const MAX_MISSES = 7;
const MAX_SKIPS = 8;
let index = 0;
let misses = 0;
let skips = 0;
let success = false;
let keyPressed = false;
let expectedKeys = [];
let imageText = document.querySelector('.image-text');
let image = document.querySelector('.image-container img');

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
	1100, 1100, 1100, 1000, 400, 1100, 3200, 
	1100, 1100, 1100, 1100, 400, 3600, 
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


function updateImageText() {
	console.log(misses, skips);
	if (skips > MAX_SKIPS || misses >= MAX_MISSES) {
		const audioElement = document.querySelector('#audio-element');
		audioElement.pause();
		imageText.style.top = '55%';
		imageText.style.left = '42%';
		imageText.innerHTML = '';
		document.body.style.backgroundColor = '#F67280';
		return;
	}
	let currDelay = delay[index];
	if (index < window.notes.length) {    
		if (index > 2) {
			if (skips <= MAX_SKIPS && misses < MAX_MISSES) {
				let pillar = positions[Math.floor(Math.random() * positions.length)];
				imageText.style.top = pillar[0] + '%';
				imageText.style.left = pillar[1] + '%';
				imageText.style.fontSize = originalFontSize + 'px';
				updateKeyframes(imageText);
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
					setTimeout(() => {
						reject(new Error('Timeout'));
					}, Math.min(800, currDelay));
				});
				  
				keyPressPromise
				.then(() => {
					console.log('Key pressed');
					setTimeout(() => {
						if (index < window.notes.length && skips <= MAX_SKIPS && misses < MAX_MISSES){
							document.body.style.backgroundColor = originalBackgroundColor;
						}
					}, 800);
				})
				.catch((error) => {
					console.log(error.message);
					setTimeout(() => {
						if (index < window.notes.length && skips <= MAX_SKIPS && misses < MAX_MISSES){
							document.body.style.backgroundColor = originalBackgroundColor;
						}
					}, 800);
					skips++;
				});
			} else {
				document.body.style.backgroundColor = '#F67280';
				updateImageText();
			}
		} else {
			pillar = [35, 43];
			imageText.style.top = pillar[0] + '%';
			imageText.style.left = pillar[1] + '%';
			imageText.style.fontSize = (originalFontSize * 3) + 'px';
			updateKeyframes(imageText);
		}
		if (skips <= MAX_SKIPS && misses < MAX_MISSES) {
			imageText.classList.remove('image-text');
			void imageText.offsetWidth;
			imageText.classList.add('image-text');
			imageText.innerHTML = window.notes[index];
		} else if (index < window.notes.length - 1) {
			success = true;
			document.body.style.backgroundColor = '#77DD77';
		}
		index++;
		setTimeout(updateImageText, currDelay);
	} else {
		document.body.style.backgroundColor = '#77DD77';
		imageText.innerHTML = '';
	}
}


document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('#play-button');
	const audioElement = document.querySelector('#audio-element');
    playButton.addEventListener('click', () => {
        playButton.style.display = 'none';
        audioElement.play();
        updateImageText();
    });
});