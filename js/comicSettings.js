
////////////////////
// Comic settings // 
////////////////////

// variables 

let currentPage = 0;

// Toggle settings overlay
document.getElementById('toggleButton').addEventListener('click', function() {
    var toolbox = document.querySelector('.toolBox');
    var toggleButton = document.getElementById('toggleButton');
    if (toolbox.style.right === '0px' || toolbox.style.right === '') {
        toolbox.style.right = '-300px'; // Hide toolbox
        toggleButton.style.right = '0px'; // Move button next to the edge
    } else {
        toolbox.style.right = '0px'; // Show toolbox
        toggleButton.style.right = '300px'; // Move button next to the toolbox
    }
});


// Overlay text setting

function createTextOverlay(subjectiveText, objectiveText, gridArea) {
    let subjectiveOverlay = document.createElement('div');
    subjectiveOverlay.classList.add('subjectiveTextOverlay');
    subjectiveOverlay.textContent = subjectiveText;
    subjectiveOverlay.style.gridArea = gridArea;

    let objectiveOverlay = document.createElement('div');
    objectiveOverlay.classList.add('objectiveTextOverlay');
    objectiveOverlay.textContent = objectiveText;
    objectiveOverlay.style.gridArea = gridArea;

    return { subjectiveOverlay, objectiveOverlay };
}


document.getElementById('addSubjectiveNarrationCheckbox').addEventListener('change', function() {
    let subjectiveOverlays = document.querySelectorAll('.subjectiveTextOverlay');
    subjectiveOverlays.forEach(overlay => {
        overlay.classList.toggle('hidden', !this.checked);
    });
    checkTextCheckboxStatus();
});

document.getElementById('addObjectiveNarrationCheckbox').addEventListener('change', function() {
    let objectiveOverlays = document.querySelectorAll('.objectiveTextOverlay');
    objectiveOverlays.forEach(overlay => {
        overlay.classList.toggle('hidden', !this.checked);
    });
    checkTextCheckboxStatus();
});

function checkTextCheckboxStatus() {
    let isObjectiveChecked = document.getElementById('addObjectiveNarrationCheckbox').checked;
    let isSubjectiveChecked = document.getElementById('addSubjectiveNarrationCheckbox').checked;
    document.getElementById('addTextCheckbox').checked = isObjectiveChecked || isSubjectiveChecked;
}



document.getElementById('addTextCheckbox').addEventListener('change', function() {
    let isChecked = this.checked;
    document.getElementById('addSubjectiveNarrationCheckbox').checked = isChecked;
    document.getElementById('addObjectiveNarrationCheckbox').checked = isChecked;
    document.getElementById('addSubjectiveNarrationCheckbox').dispatchEvent(new Event('change'));
    document.getElementById('addObjectiveNarrationCheckbox').dispatchEvent(new Event('change'));
});



// Toggle light mode and dark mode
document.querySelectorAll('input[name="theme"]').forEach(function(elem) {
    elem.addEventListener('change', function() {
        if (document.getElementById('darkMode').checked) {
            document.querySelector('.bodyGrid').classList.add('dark-mode');
        } else {
            document.querySelector('.bodyGrid').classList.remove('dark-mode');
        }
    });
});

// Play animation 
document.getElementById('addAnimationCheckbox').addEventListener('change', function() {
    let videos = document.querySelectorAll('.comicGrid video');
    videos.forEach(video => {
        if (this.checked) {
            video.autoplay = true;
            video.play();
            // Set the playback rate based on the slider value
            video.playbackRate = parseFloat(document.getElementById('playbackSpeedSlider').value);
        } else {
            video.autoplay = false;
            video.pause();
        }
    });
});


// Play sound 

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


document.getElementById('addAudioCheckbox').addEventListener('change', function() {
    let audioButtons = document.querySelectorAll('.audioButton');
    audioButtons.forEach(button => {
        if (this.checked) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
            if (button.audio && button.getAttribute('data-playing') === 'true') {
                button.audio.pause();
                button.setAttribute('data-playing', 'false');
                updateAudioButtonSymbol(button);
            }
        }
    });
});


document.addEventListener("DOMContentLoaded", function() {
    generateLayout().then(() => {
        // Set checkbox to checked by default
        document.getElementById('addAudioCheckbox').checked = true; 
        // Trigger change event to set initial state of audio buttons
        document.getElementById('addAudioCheckbox').dispatchEvent(new Event('change'));

        // Event listeners for audio play options
        document.getElementById('repeatingAudio').addEventListener('change', function() {
            if (currentlyPlayingAudioButton && currentlyPlayingAudioButton.audio) {
                currentlyPlayingAudioButton.audio.loop = true;
            }
        });

        document.getElementById('singleAudio').addEventListener('change', function() {
            if (currentlyPlayingAudioButton && currentlyPlayingAudioButton.audio) {
                currentlyPlayingAudioButton.audio.loop = false;
            }
        });
    });
});

document.getElementById('playbackSpeedSlider').addEventListener('input', function() {
    let videos = document.querySelectorAll('.comicGrid video');
    videos.forEach(video => {
        video.playbackRate = parseFloat(this.value);
    });
});


// define experience 

document.getElementById('scrollExperience').addEventListener('change', function() {
    if (this.checked) {
        document.querySelector('.comicGrid').classList.remove('slideExperience');
        document.querySelectorAll('.scrollButtons').forEach(btn => btn.style.display = 'block'); // Show scroll buttons
        document.querySelectorAll('.slideButtons').forEach(btn => btn.style.display = 'none'); // Hide slide buttons
    }
});

document.getElementById('slideExperience').addEventListener('change', function() {
    if (this.checked) {
        document.querySelector('.comicGrid').classList.add('slideExperience');
        document.querySelectorAll('.scrollButtons').forEach(btn => btn.style.display = 'none'); // Hide scroll buttons
        document.querySelectorAll('.slideButtons').forEach(btn => btn.style.display = 'block'); // Show slide buttons
    }
});

document.getElementById('upPageButton').addEventListener('click', function() {
    // Logic to scroll up
    if (currentPage > 0) {
        currentPage--;
        const offset = document.querySelectorAll('.comicPage')[currentPage].offsetTop;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
});

document.getElementById('downPageButton').addEventListener('click', function() {
    // Logic to scroll down
    const pages = document.querySelectorAll('.comicPage');
    if (currentPage < pages.length - 1) {
        currentPage++;
        const offset = pages[currentPage].offsetTop;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    }
});


function navigatePage(direction) {
    const pages = document.querySelectorAll('.comicGrid .comicPage');
    if (direction === 'next' && currentPage < pages.length - 1) {
        currentPage++;
    } else if (direction === 'prev' && currentPage > 0) {
        currentPage--;
    }

    // Calculate the exact offset to scroll to
    const comicGrid = document.querySelector('.comicGrid');
    const offset = pages[currentPage].offsetLeft - comicGrid.offsetLeft;
    comicGrid.scrollTo({ left: offset, behavior: 'smooth' });
}

document.getElementById('prevPageButton').addEventListener('click', function() {
    navigatePage('prev');
});

document.getElementById('nextPageButton').addEventListener('click', function() {
    navigatePage('next');
});


// Function to set initial button visibility based on experience
function setInitialButtonVisibility() {
    if (document.getElementById('scrollExperience').checked) {
        document.querySelectorAll('.scrollButtons').forEach(btn => btn.style.display = 'block'); // Show scroll buttons
        document.querySelectorAll('.slideButtons').forEach(btn => btn.style.display = 'none'); // Hide slide buttons
    } else if (document.getElementById('slideExperience').checked) {
        document.querySelectorAll('.scrollButtons').forEach(btn => btn.style.display = 'none'); // Hide scroll buttons
        document.querySelectorAll('.slideButtons').forEach(btn => btn.style.display = 'block'); // Show slide buttons
    }
}

// Call the function to set the initial state of buttons
document.addEventListener("DOMContentLoaded", function() {
    generateLayout().then(() => {
        setInitialButtonVisibility(); 
    });
});
