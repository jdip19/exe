// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Variable to store the current view
let currentView = 'mainScreen';

figma.ui.onmessage = msg => {
  if (msg.type === 'load-view') {
    // Update the current view based on the message
    currentView = msg.view;
    loadView(currentView);
  } else if (msg.type === 'paste-text') {
    const text = msg.text;

    // Check if there is a text node selected
    if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'TEXT') {
      const textNode = figma.currentPage.selection[0] as TextNode;

      // Load the 'Inter Bold' font before setting the text
      figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
        .then(() => {
          // Set the text after the font is loaded
          textNode.characters = text;
        })
        .catch((error) => {
          console.error('Error loading font:', error);
        });
    } else {
      // Inform the user that they need to select a text layer
      figma.notify('Please select a text layer to paste the text.');
    }
  } else if (msg.type === 'update-text') {
    const inputText = document.getElementById('inputText') as HTMLTextAreaElement;
    inputText.value = msg.updatedText;
  } else if (msg.type === 'create-rectangles') {
    const nodes: SceneNode[] = [];
    const rectangleWidth = 200; // Set the desired width

    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * (rectangleWidth + 10); // Add some spacing between rectangles
      rect.resize(rectangleWidth, rect.height); // Set the width explicitly
      rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
};



// Function to load a specific HTML view
function loadView(view: string) {
  figma.ui.postMessage({ type: 'load-view', view });
}

// Load the initial view
loadView(currentView);

//figma.closePlugin();