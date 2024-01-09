
// Variables 
let currentlyPlayingAudioButton = null;

async function generateLayout() {
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
                // In the loop where you append elements:
                const { subjectiveOverlay, objectiveOverlay } = createTextOverlay(content.subjectiveText, content.objectiveText, content.gridArea);
                page.appendChild(subjectiveOverlay);
                page.appendChild(objectiveOverlay);

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

document.addEventListener("DOMContentLoaded", generateLayout);
