// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(300, 400);

figma.ui.onmessage = msg => {
  if (msg.type === 'paste-text') {
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
  } else if (msg.type === 'createTextLayer') {
    const inputText = msg.text; // Extract the text from the message
    const lines = inputText.split('\n'); // Split the text into lines

    // Load the font asynchronously
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
        // Font loaded, proceed to create text nodes
        lines.forEach((line: string, index: number) => {
            const textNode = figma.createText();
            textNode.x = 50;
            textNode.y = index * 50; // Adjust the spacing as needed
            textNode.characters = line;

            figma.currentPage.appendChild(textNode);

            // Set the font for the text node
            textNode.fontName = { family: 'Inter', style: 'Regular' };
        });
    }).catch((error) => {
        console.error('Error loading font:', error);
    });
}

};

// Function to load a specific HTML view
function loadView(view: string) {
  figma.ui.postMessage({ type: 'load-view', view });
}

// Load the initial view
loadView('textareaView');


//figma.closePlugin();