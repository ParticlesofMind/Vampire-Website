// CombinedScript.js
async function generateAndPopulateLayout() {
    // Generate Layout
    const container = document.querySelector('.comicContainer');
    for (let i = 1; i <= 3; i++) {
        const page = document.createElement('div');
        page.classList.add('page');
        page.style.gridRow = `${i} / ${i + 1}`; // Position pages vertically
        container.appendChild(page);
    }

    // Populate Layout
    try {
        const response = await fetch('/json/imagePaths.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const imagePaths = await response.json();

        const videoData = imagePaths.page1.video;
        const video = document.createElement('video');
        video.src = videoData.src;
        video.style.gridArea = videoData.gridArea;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        document.querySelector('.comicContainer .page:nth-child(1)').appendChild(video);

        [imagePaths.page2, imagePaths.page3].forEach((page, pageIndex) => {
            page.forEach(image => {
                const img = document.createElement('img');
                img.src = image.src;
                img.style.gridArea = image.gridArea;
                document.querySelector(`.comicContainer .page:nth-child(${pageIndex + 2})`).appendChild(img);
            });
        });
    } catch (error) {
        console.error('Error loading image paths:', error);
    }

    // ToolBox toggle functionality
    const toolBox = document.createElement('div');
    toolBox.id = 'toolBox';
    toolBox.classList.add('toolBox');
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleToolBox';
    toggleButton.classList.add('toggleToolBox');
    toggleButton.innerHTML = '&raquo;';
    const toolOptions = document.createElement('div');
    toolOptions.classList.add('toolOptions');
    
    // Filler options for toolbox
    const option1 = document.createElement('label');
    option1.innerHTML = '<input type="radio" name="view-option" checked> Zoom In';
    const option2 = document.createElement('label');
    option2.innerHTML = '<input type="radio" name="view-option"> Zoom Out';
    // Add more options as needed...
    
    toolOptions.appendChild(option1);
    toolOptions.appendChild(option2);
    // Append more options as created...

    toolBox.appendChild(toggleButton);
    toolBox.appendChild(toolOptions);
    document.body.appendChild(toolBox);

    toggleButton.addEventListener('click', function() {
        const isOpen = toolBox.style.right === '0px';
        toolBox.style.right = isOpen ? '-250px' : '0px';
        toggleButton.innerHTML = isOpen ? '&raquo;' : '&laquo;'; // Change the arrow direction
    });
}

document.addEventListener("DOMContentLoaded", generateAndPopulateLayout);
