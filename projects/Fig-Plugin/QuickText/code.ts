figma.showUI(__html__);
figma.ui.resize(300, 460);

figma.ui.onmessage = msg => {
  if (msg.type === 'pasteToTextbox') {
    if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'TEXT') {
      const textNode = figma.currentPage.selection[0] as TextNode;
      figma.ui.postMessage({ type: 'updateInputText', value: textNode.characters });
    } else {
      figma.notify('Please select a text layer to paste in the textbox.');
    }

  } else if (msg.type === 'paste-text') {
    const text = msg.text;

    // Check if there is a text node selected
    if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'TEXT') {
      const textNode = figma.currentPage.selection[0] as TextNode;

      // Get font properties of the selected text layer
      const fontName = textNode.fontName as FontName;

      // Check if fontName is valid and has the family and style properties
      if (fontName && 'family' in fontName && 'style' in fontName) {
        const fontFamily = fontName.family as string;
        const fontStyle = fontName.style as string;

        figma.loadFontAsync({ family: fontFamily, style: fontStyle })
          .then(() => {
            textNode.fontName = { family: fontFamily, style: fontStyle };
            textNode.characters = text;
          })
          .catch((error) => {
            console.error('Error loading font:', error);
          });
      } else {
        console.error('Invalid font name object:', fontName);
      }
    } else {
      figma.notify('Please select a text layer to paste the text.');
    }
  } else if (msg.type === 'createTextLayer') {


    const breakLines = msg.text.split('\n');
    const lines: string[] = [];

    // Iterate through each line and push it into the lines array
    breakLines.forEach((line: string) => {
      lines.push(line);
    });

    // Log the lines array to the console
    console.log(lines);

    
    const viewPort = figma.viewport.bounds;
    const vX = viewPort.x;
    const vY = viewPort.y;
    const vW = viewPort.width;
    const vH = viewPort.height;
    const spacing=20;
    
    // Load the font asynchronously
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
      // Font loaded, proceed to create text nodes
      lines.forEach((line: string, index: number) => {
        const textNode = figma.createText();
        textNode.characters = line;
    
        // Calculate the y position for each text node
        textNode.y = vY + index * (textNode.height + spacing);
        
        // Place the text node horizontally in the center of the viewport
        textNode.x = vX + vW / 2 - textNode.width / 2; 
        
        figma.currentPage.appendChild(textNode);
        
        // Set the font for the text node
        textNode.fontName = { family: 'Inter', style: 'Regular' };
    });
    }).catch((error) => {
      console.error('Error loading font:', error);
    });
    figma.notify(lines.length+' Text layer created');
  }
};

// Function to load a specific HTML view
function loadView(view: string) {
  figma.ui.postMessage({ type: 'load-view', view });
}

// Load the initial view
loadView('textareaView');