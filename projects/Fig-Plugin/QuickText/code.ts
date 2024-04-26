
let textNode: TextNode | null = null; // Initialize as null
const selection = figma.currentPage.selection;
const textNodes = selection.filter(node => node.type === 'TEXT') as TextNode[];


textNodes.forEach(textNode => {
  const fontName = textNode.fontName as FontName;
  if (fontName && 'family' in fontName && 'style' in fontName) {
    const fontFamily = fontName.family as string;
    const fontStyle = fontName.style as string;

    figma.loadFontAsync({ family: fontFamily, style: fontStyle })
      .then(() => {
        textNode.fontName = { family: fontFamily, style: fontStyle }; // Update textNode properties
        handleTextCase(textNode); // Call the function to handle text case based on command
      })
      .catch((error) => {
        console.error('Error loading font:', error);
      });
  } else {
    console.error('Invalid font name object:', fontName);
  }
});
if (textNodes.length === 0) {
  figma.notify('Buddy! Just select one text layer. 😊');
}

function handleTextCase(node: TextNode): void {
  let newText;
  switch (figma.command) {
    case 'titlecase':
      const conjunctions = ['for', 'in', 'on', 'of', 'am', 'are', 'and', 'to', 'is', 'at', 'also',];
      newText = node.characters; // Assuming node.characters contains the text
      newText = newText.replace(/\b(\w+)\b/g, (match, word) => {
        if (word.toUpperCase() === word || conjunctions.indexOf(word.toLowerCase()) !== -1) {
          return word;
        } else {
          return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase(); // Convert to sentence case
        }
      });
      if (newText === newText.toUpperCase()) {
        newText = newText.toLowerCase(); // Convert to lowercase
        newText = newText.replace(/\b(\w+)\b/g, (match, word) => {
          // Check if the word is a conjunction, then keep it lowercase
          if (conjunctions.indexOf(word.toLowerCase()) !== -1) {
            return word.toLowerCase();
          } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
        });
      }
      node.characters = newText; // Update the node with the modified text
      figma.notify('Tadaannn... 🥁 Your Text case changed to TitleCase.');
      break;

    case 'sentencecase':
      // Convert the text to lowercase first
      newText = node.characters.toLowerCase();

      // Define the regular expression pattern to match the beginning of sentences
      const sentenceRegex = /(^|[.!?]\s+)(\w+)/g;

      // Replace the matched patterns with capitalized letters
      newText = newText.replace(sentenceRegex, (match, boundary, word) => {
        // Check if the word is an acronym (all uppercase), if so, keep it as it is
        const isAcronym = word.length > 1 && word === word.toUpperCase();
        if (isAcronym) {
          return match;
        } else {
          return boundary + word.charAt(0).toUpperCase() + word.slice(1);
        }
      });
      node.characters = newText; // Update the node with the modified text
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

    case 'addbreakline':
      node.characters = node.characters.replace(/\. ?([A-Z])/g, '.\n$1'); // Add a line break after a full stop followed by an optional space and uppercase letter
      figma.notify('Tadaannn... 🥁 Your Text now has line breaks after sentences.');
      break;

    case 'rmvbreakline':
      node.characters = node.characters.replace(/\n/g, ' '); // Replace all line breaks with an empty string
      figma.notify('Tadaannn... 🥁 Your Text is now breakline free.');
      break;

    case 'rmvspace':
      node.characters = node.characters.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
      figma.notify('Tadaannn... 🥁 Your Text is now space free.');
      break;

    default:
      console.error('Unknown command:', figma.command);
  }
}


setTimeout(() => {
  figma.closePlugin();
}, 1000);
