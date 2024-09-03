// Collect all SVG elements on the page
console.log("content file");

const svgs = document.querySelectorAll('svg');
const svgData = Array.from(svgs).map(svg => svg.outerHTML);

// Store the SVG data in local storage
chrome.storage.local.set({ svgData });
