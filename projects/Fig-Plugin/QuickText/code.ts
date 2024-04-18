
let textNode: TextNode | null = null; // Initialize as null
const selection = figma.currentPage.selection;
textNode = selection.length === 1 && selection[0].type === 'TEXT' ? selection[0] as TextNode : null;

if (textNode) {
  const fontName = textNode.fontName as FontName;
  if (fontName && 'family' in fontName && 'style' in fontName) {
    const fontFamily = fontName.family as string;
    const fontStyle = fontName.style as string;

    figma.loadFontAsync({ family: fontFamily, style: fontStyle })
      .then(() => {
        textNode!.fontName = { family: fontFamily, style: fontStyle }; // Update textNode properties
        handleTextCase(textNode!); // Call the function to handle text case based on command
      })
      .catch((error) => {
        console.error('Error loading font:', error);
      });
  } else {
    console.error('Invalid font name object:', fontName);
  }
} else {
  figma.notify('Buddy! Just Select a single text layer. 😊');
}

function handleTextCase(node: TextNode): void {
  switch (figma.command) {
    case 'titlecase':
      const conjunctions = ['for', 'in', 'on', 'of', 'am', 'are', 'and', 'to', 'is', 'at'];
      let newText = node.characters.toLowerCase(); // Convert the text to lowercase first
      newText = newText.replace(/\b(\w+)\b/g, (match, word) => {
        // Check if the word is in the conjunctions list, if so, keep it lowercase
        return conjunctions.indexOf(word) !== -1 ? word : match.charAt(0).toUpperCase() + match.slice(1);
      });
      node.characters = newText; // Update the node with the modified text
      figma.notify('Tadaannn... 🥁 Your Text case changed to TitleCase.');
      break;
    case 'sentencecase':
      node.characters = node.characters.toLowerCase();
      node.characters = node.characters.replace(/(^\w|\.\s\w)/g, (match) => match.toUpperCase()); // Update the node with the modified text
      figma.notify('Tadaannn... 🥁 Your Text case changed to Sentencecase.');
      break;
    case 'uppercase':
      node.characters = node.characters.toUpperCase();
      figma.notify('Tadaannn... 🥁 Your Text case changed to UPPERCASE.');
      break;
    case 'lowercase':
      node.characters = node.characters.toLowerCase();
      figma.notify('Tadaannn... 🥁 Your Text case changed to lowercase.');
      break;

    default:
      console.error('Unknown command:', figma.command);
  }
}


setTimeout(() => {
  figma.closePlugin();
}, 1000);
