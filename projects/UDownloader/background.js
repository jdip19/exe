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
