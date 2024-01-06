
let currentlyPlayingAudioButton = null;

async function generateAndPopulateLayout() {
    const container = document.querySelector('.comicGrid');

    try {
        const response = await fetch('/json/imagePaths.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const pagesData = await response.json();

        Object.keys(pagesData).forEach((pageKey, pageIndex) => {
            const page = document.createElement('div');
            page.classList.add('comicPage');
            page.style.gridRow = `${pageIndex + 1} / ${pageIndex + 2}`;
            container.appendChild(page);

            let contents = pagesData[pageKey];
            if (!Array.isArray(contents)) {
                contents = [contents];
            }

            contents.forEach(content => {
                let element, textOverlay;
                if (content.src.endsWith('.mp4')) {
                    element = document.createElement('video');
                    Object.assign(element, { src: content.src, autoplay: true, loop: true, muted: true });
                } else {
                    element = document.createElement('img');
                    element.src = content.src;
                }
                element.style.gridArea = content.gridArea;
                page.appendChild(element);

                // Creating and appending text overlay for each image
                textOverlay = createTextOverlay(content.text || 'Lorem ipsum dolor sit amet...');
                textOverlay.style.gridArea = content.gridArea;
                page.appendChild(textOverlay);

                if (content.audio) {
                    let audioButton = createAudioButton(content.audio, content.gridArea);
                    page.appendChild(audioButton);
                }
            });
        });
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function createTextOverlay(text) {
    let textOverlay = document.createElement('div');
    textOverlay.classList.add('textOverlay'); // Remove 'hidden' class
    textOverlay.textContent = text;
    return textOverlay;
}

function createAudioButton(audioSrc, imageGridArea) {
    let button = document.createElement('button');
    button.classList.add('audioButton');
    button.setAttribute('data-playing', 'false'); // Initially not playing
    updateAudioButtonSymbol(button); // Set initial symbol
    button.onclick = function() { toggleAudio(audioSrc, this); };

    // Calculate grid area for the audio button
    let gridArea = calculateButtonGridArea(imageGridArea);
    button.style.gridArea = gridArea;

    return button;
}

function calculateButtonGridArea(imageGridArea) {
    // Split the image grid area into individual values
    let [rowStart, colStart, rowEnd, colEnd] = imageGridArea.split(' / ').map(Number);
    // Calculate the bottom-leftmost cell
    let buttonRowStart = rowEnd - 1;
    let buttonRowEnd = rowEnd;
    let buttonColStart = colStart;
    let buttonColEnd = colStart + 1;

    return `${buttonRowStart} / ${buttonColStart} / ${buttonRowEnd} / ${buttonColEnd}`;
}


function updateAudioButtonSymbol(button) {
    if (button.getAttribute('data-playing') === 'false') {
        button.innerHTML = '&#x1F507;'; // Loudspeaker with line (muted)
    } else {
        button.innerHTML = '&#x1F50A;'; // Loudspeaker (playing)
    }
}

function toggleAudio(src, button) {
    if (!button.audio) {
        button.audio = new Audio(src);
        // Set loop based on current radio button setting
        button.audio.loop = document.getElementById('repeatingAudio').checked;
    }

    if (button.getAttribute('data-playing') === 'true') {
        button.audio.pause();
        button.setAttribute('data-playing', 'false');
        currentlyPlayingAudioButton = null;
    } else {
        if (currentlyPlayingAudioButton) {
            currentlyPlayingAudioButton.audio.pause();
            currentlyPlayingAudioButton.setAttribute('data-playing', 'false');
            updateAudioButtonSymbol(currentlyPlayingAudioButton);
        }
        button.audio.play();
        button.setAttribute('data-playing', 'true');
        currentlyPlayingAudioButton = button;
    }
    updateAudioButtonSymbol(button);
}


document.addEventListener("DOMContentLoaded", generateAndPopulateLayout);
