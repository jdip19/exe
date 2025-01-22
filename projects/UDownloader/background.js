chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "copySvg",
        title: "Copy SVG",
        contexts: ["link"] // Context menu appears only on links
    });

    chrome.contextMenus.create({
        id: "downloadSvg",
        title: "Download SVG",
        contexts: ["link"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copySvg") {
        handleSvgExtraction(info.linkUrl, "copy");
    } else if (info.menuItemId === "downloadSvg") {
        handleSvgExtraction(info.linkUrl, "download");
    }
});

function handleSvgExtraction(detailLink, action) {
    if (detailLink) {
        chrome.tabs.create({ url: detailLink, active: true }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(listener); // Avoid duplicate listeners

                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: extractSvg,
                        args: [action] // Pass "copy" or "download" to the function
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error injecting script:", chrome.runtime.lastError.message);
                        }
                    });
                }
            });
        });
    } else {
        console.error("Invalid detail link provided.");
    }
}

function extractSvg(action) {
    const editButton = document.querySelector("#detail_edit_icon");
    if (editButton) {
        editButton.click();
        setTimeout(() => {
            const svgElement = document.querySelector(".detail__editor__icon-holder svg");
            console.log
            if (svgElement) {
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svgElement);

                if (action === "copy") {
                    // Copy the SVG to the clipboard
                    const textarea = document.createElement("textarea");
                    textarea.value = svgString;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    alert("SVG copied to clipboard!");
                } else if (action === "download") {
                    // Download the SVG
                    const blob = new Blob([svgString], { type: "image/svg+xml" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "downloaded-icon.svg";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    alert("SVG downloaded successfully!");
                }
            } else {
                alert("SVG element not found.");
            }
        }, 3000); // Wait for the SVG to render
    } else {
        alert("Edit button not found on the detail page.");
    }
}

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
