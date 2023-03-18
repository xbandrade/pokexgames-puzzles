let index = 0;
let imageText = document.querySelector('.image-text');
let image = document.querySelector('.image-container img');

function updateKeyframes() {
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
    let keyframesRule;
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
      if (styleSheet.cssRules[i] instanceof CSSKeyframesRule && styleSheet.cssRules[i].name === 'blink-and-move-up') {
        keyframesRule = styleSheet.cssRules[i];
        break;
      }
    }
  console.log(1, keyframesRule);

  if (keyframesRule) {
    keyframesRule.deleteRule('0%');
    keyframesRule.deleteRule('60%');
    keyframesRule.deleteRule('100%');
    
    let topStart = parseInt(imageText.style.top);
    let topEnd = topStart - 10;
    
    keyframesRule.appendRule(`0% { opacity: .8; top: ${topStart}%; }`);
    keyframesRule.appendRule(`60% { opacity: 0; top: ${topEnd}%; }`);
    keyframesRule.appendRule(`100% { opacity: 0; top: ${topEnd}%; }`);
    
    console.log(keyframesRule);
  }
}

function updateImageText() {
  console.log('Updating image text:', window.notes[index]);
  if (index < window.notes.length) {    
    let positions = [
        [10, 47],
        [25, 20],
        [25, 73],
        [62, 13],
        [62, 79],
        [85, 57],
        [85, 26],
    ]
    let pillar = positions[Math.floor(Math.random() * positions.length)];
    imageText.style.top = pillar[0] + '%';
    imageText.style.left = pillar[1] + '%';
    updateKeyframes();
    imageText.classList.remove('image-text');
    void imageText.offsetWidth;
    imageText.classList.add('image-text');
    imageText.innerHTML = window.notes[index];
    index++;
    setTimeout(updateImageText, 1000);
  } else {
    setTimeout(() => {
      imageText.innerHTML = '';
    }, 500);
  }
}
updateImageText();