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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
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
            const blob = new Blob([svgString], {type: 'image/svg+xml'});

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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
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