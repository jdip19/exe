document.addEventListener('DOMContentLoaded', function () {
    const iconTab = document.getElementById('iconTab');
    const imageTab = document.getElementById('imageTab');
    const iconContent = document.getElementById('iconContent');
    const imageContent = document.getElementById('imageContent');
    const imageList = document.getElementById('imageList');

    // Add click event listeners for tabs
    iconTab.addEventListener('click', function () {
        iconTab.classList.add('active');
        imageTab.classList.remove('active');
        iconContent.classList.add('active');
        imageContent.classList.remove('active');
    });

    imageTab.addEventListener('click', function () {
        imageTab.classList.add('active');
        iconTab.classList.remove('active');
        imageContent.classList.add('active');
        iconContent.classList.remove('active');
    });

    // Load images from storage when the popup opens
    chrome.storage.local.get('imageUrls', (data) => {
        if (data.imageUrls) {
            displayImages(data.imageUrls);
        }
    });

    // Function to display images based on the selected filter
    function displayImages(images) {
        imageList.innerHTML = ''; // Clear previous images

        // Get selected filter value
        const selectedFilter = document.querySelector('input[name="imageFilter"]:checked').value;
        const message = document.getElementById('message'); // Get the message element
        message.style.display = 'none'; // Initially hide the message

        let hasImages = false;


        images.forEach((imageSrc) => {
            // Filter based on the selected filter
            if ((selectedFilter === 'jpeg' && (imageSrc.endsWith('.jpg') || imageSrc.endsWith('.jpeg'))) ||
                (selectedFilter === 'png' && imageSrc.endsWith('.png')) ||
                (selectedFilter === 'webp' && imageSrc.endsWith('.webp'))) {

                hasImages = true; // Set the flag to true if an image is added
                const li = document.createElement('li');
                const img = document.createElement('img');
                img.src = imageSrc;
                li.appendChild(img);
                imageList.appendChild(li);
            }
        });

        // Show message if no images were found
        if (!hasImages) {
            message.style.display = 'flex'; // Show the message if no images were added
        } else {
            message.style.display = 'none'; // Hide the message if images were found
        }
    }

    // Event listener for radio buttons to filter images
    document.querySelectorAll('input[name="imageFilter"]').forEach(radio => {
        radio.addEventListener('change', function () {
            // Load images from storage and filter on change
            chrome.storage.local.get('imageUrls', (data) => {
                if (data.imageUrls) {
                    displayImages(data.imageUrls);
                }
            });
        });
    });

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ['contentScript.js']
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    const images = results[0].result;
                    if (images.length > 0) {
                        // Store the new image URLs in storage
                        chrome.storage.local.set({ imageUrls: images }, () => {
                            displayImages(images); // Display images immediately
                        });
                    }
                }
            }
        );
    });
});






document.getElementById('downloadBtn').addEventListener('click', () => {
    const imageUrls = document.getElementById('imageUrls').value.split('\n').map(url => url.trim()).filter(url => url);
    const folderNameInput = document.getElementById('folderName').value.trim(); // Get the folder name from user input

    if (imageUrls.length > 0) {
        // Use the folder name provided by the user, if any
        const folderName = folderNameInput !== '' ? folderNameInput : '';

        imageUrls.forEach(url => {
            const fileName = url.split('/').pop(); // Extract file name from the URL

            chrome.downloads.download({
                url: url,
                filename: folderName ? `${folderName}/${fileName}` : fileName, // If folderName exists, use it; otherwise, download as it is
                saveAs: false // Automatically download without prompt
            });
        });

        if (folderName) {
            alert(`Downloading ${imageUrls.length} images into folder: ${folderName}`);
        } else {
            alert(`Downloading ${imageUrls.length} images to default location without folder`);
        }
    } else {
        alert("Please enter at least one valid image URL.");
    }
});
document.getElementById('svgDownloadBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: downloadSvgWithAutoDetection
        });
    });
});

function downloadSvgWithAutoDetection() {
    // Check if the edit button exists and trigger it to reveal the SVG if necessary
    const editButton = document.querySelector('#detail_edit_icon');
    if (editButton) {
        editButton.click(); // Click the button to ensure the SVG is visible
    }

    // Wait for the SVG to load
    setTimeout(() => {
        const svgElement = document.querySelector('.detail__editor__icon-holder svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            // Create a Blob for the SVG content
            const blob = new Blob([svgString], { type: 'image/svg+xml' });

            // Create a link and trigger the download
            const link = document.createElement('a');
            const fileName = 'downloaded-icon.svg';  // Default name for the file
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // alert('SVG file downloaded successfully');
        } else {
            alert('SVG element not found. Please ensure it is present on the page.');
        }
    }, 2000); // Adjust the timeout delay if needed based on page behavior
}
document.getElementById('svgCopyBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: copySvgWithAutoDetection
        });
    });
});

function copySvgWithAutoDetection() {
    // Check if the edit button exists and trigger it to reveal the SVG if necessary
    const editButton = document.querySelector('#detail_edit_icon');
    if (editButton) {
        editButton.click(); // Click the button to ensure the SVG is visible
    }

    // Wait for the SVG to load
    setTimeout(() => {
        const svgElement = document.querySelector('.detail__editor__icon-holder svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            // Copy the SVG content to the clipboard
            const textarea = document.createElement('textarea');
            textarea.value = svgString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            // alert('SVG content copied to clipboard.');
        } else {
            alert('SVG element not found. Please ensure it is present on the page.');
        }
    }, 2000); // Adjust the timeout delay if needed based on page behavior
}

