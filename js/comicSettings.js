
////////////////////
// Comic settings // 
////////////////////

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
document.getElementById('addTextCheckbox').addEventListener('change', function() {
    let overlays = document.querySelectorAll('.textOverlay');
    overlays.forEach(overlay => {
        if (!this.checked) {  // If checkbox is not checked
            overlay.classList.add('hidden');
        } else {
            overlay.classList.remove('hidden');
        }
    });
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
            video.play(); // Start playing the video
        } else {
            video.autoplay = false;
            video.pause(); // Pause the video
        }
    });
});

// Play sound 

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
    generateAndPopulateLayout().then(() => {
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
