// Handle context menu clicks
// Handle context menu clicks
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copySvg",
        title: "Copy SVG Content",
        contexts: ["link"]
    });

    chrome.contextMenus.create({
        id: "downloadSvg",
        title: "Download SVG File",
        contexts: ["link"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "copySvg") {
        handleSvgExtraction(info.linkUrl, "copy");
    } else if (info.menuItemId === "downloadSvg") {
        handleSvgExtraction(info.linkUrl, "download");
    }
});

// Function to extract SVG (copy/download) from the page
function handleSvgExtraction(detailLink, action) {
    chrome.tabs.create({ url: detailLink, active: false }, (tab) => {
        // After the page is opened in the background, inject the script to get the SVG
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractAndHandleSvg,
            args: [action]  // Pass the action to the function
        });
    });
}

// This function is executed on the target page
function extractAndHandleSvg(action) {
    const editButton = document.querySelector('#detail_edit_icon');
    if (editButton) {
        // Simulate a click to load the SVG content
        editButton.click();
        // Delay a bit to give the SVG time to load
        setTimeout(() => {
            const svgElement = document.querySelector('.detail__editor__icon-holder svg');
            if (svgElement) {
             console.log("founded SVG element"+svgElement.outerHTML);
                // Send a message to the background script to handle copy or download
                // chrome.runtime.sendMessage({ action: action, svgContent: svgElement.outerHTML });
                if (action === 'copy') {
                    console.log('Copying SVG content to clipboard...');
                    copySvgToClipboard(svgElement.outerHTML);
                } else if (action === 'download') {
                    console.log('Downloading SVG file...');
                    downloadSvg(svgElement.outerHTML);
                }
            }
        }, 4000);
    }
}

// Function to copy SVG to clipboard
function copySvgToClipboard(svgContent) {
    const textarea = document.createElement('textarea');
    textarea.value = svgContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('SVG copied to clipboard!');
}

// Function to download SVG as a file
function downloadSvg(svgContent) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'downloaded-icon.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert('SVG downloaded successfully!');
}


//Command for copying and downloading
chrome.commands.onCommand.addListener((command) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            const tabId = tabs[0].id;

            if (command === "copy_svg") {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: copySvgWithAutoDetection
                });
            } else if (command === "download_svg") {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    function: downloadSvgWithAutoDetection
                });
            }
        }
    });
});

function copySvgWithAutoDetection() {
    const editButton = document.querySelector('#detail_edit_icon');
    if (editButton) editButton.click();
    setTimeout(() => {
        const svgElement = document.querySelector('.detail__editor__icon-holder svg');
        console.log(svgElement);
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            const textarea = document.createElement('textarea');
            textarea.value = svgString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } else {
            alert('SVG element not found.');
        }
    }, 2000);
}

function downloadSvgWithAutoDetection() {
    const editButton = document.querySelector('#detail_edit_icon');
    if (editButton) editButton.click();
    setTimeout(() => {
        const svgElement = document.querySelector('.detail__editor__icon-holder svg');
        if (svgElement) {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);

            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded-icon.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('SVG element not found.');
        }
    }, 2000);
}
