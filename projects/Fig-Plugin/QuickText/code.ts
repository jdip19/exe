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

  } else if (msg.type === 'pasteToFigmaS') {
    const text = msg.text;

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
    const spacing = 20;

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
    figma.notify(lines.length + ' Text layer created');
    //figma.notify('Please select a text layer to paste the text.');

  } else if (msg.type === 'pasteToFigmaM') {


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
    const spacing = 20;

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
    figma.notify(lines.length + ' Text layer created');
  }
};


figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  const hasTextLayerSelected = selection.some(node => node.type === 'TEXT');
  if (hasTextLayerSelected) {
    console.log("layer selected");
    figma.ui.postMessage({
      type: 'ChangeSVGS', svg: `
      <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M455.726 275.973C466.758 264.942 466.758 247.058 455.726 236.028L275.961 56.2733C264.93 45.2422 247.045 45.2422 236.013 56.2733C224.982 67.3038 224.982 85.1878 236.013 96.2183L395.804 256L236.013 415.782C224.982 426.812 224.982 444.696 236.013 455.727C247.045 466.758 264.93 466.758 275.961 455.727L455.726 275.973ZM48 256C48 271.6 60.646 284.246 76.2457 284.246L435.752 284.246L435.752 227.754L76.2457 227.754C60.646 227.754 48 240.4 48 256V256Z" fill="white" />
      </svg>`
    });
  } else {
    console.log("not selected");
    figma.ui.postMessage({
      type: 'ChangeSVGM', svg: `
      <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M48 64C48 55.1634 55.1634 48 64 48H448C456.837 48 464 55.1634 464 64V122.667C464 140.34 449.673 154.667 432 154.667H80C62.3269 154.667 48 140.34 48 122.667V64Z" fill="white" />
        <path d="M48 218.667C48 209.83 55.1634 202.667 64 202.667H448C456.837 202.667 464 209.83 464 218.667V277.334C464 295.007 449.673 309.334 432 309.334H80C62.3269 309.334 48 295.007 48 277.334V218.667Z" fill="white" />
        <path d="M48 373.333C48 364.496 55.1634 357.333 64 357.333H448C456.837 357.333 464 364.496 464 373.333V432C464 449.673 449.673 464 432 464H80C62.3269 464 48 449.673 48 432V373.333Z" fill="white" />
      </svg>
    `});
  }
});


if (figma.currentPage.selection.length === 1 && figma.currentPage.selection[0].type === 'TEXT') {

  figma.ui.postMessage({ type: 'TextLayerSelected' });
  console.log("layer selected");

  figma.ui.onmessage = msg => {

    if (msg.type === 'pasteToFigma') {
      const text = msg.text;
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

    }
  };
}

// Function to load a specific HTML view
function loadView(view: string) {
  figma.ui.postMessage({ type: 'load-view', view });
}

// Load the initial view
loadView('textareaView');