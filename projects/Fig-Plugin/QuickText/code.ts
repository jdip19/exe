
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
  let newText=node.characters;
  switch (figma.command) {
    case 'titlecase':
      const conjunctions = ['for', 'an', 'a', 'in', 'on', 'of', 'am', 'are', 'and', 'to', 'is', 'at', 'also'];
    

      const TitleCase = newText.split(' ').every(word => {
        const firstLetter = word.charAt(0);
        const restOfWord = word.slice(1);
        // Check if the word has title case
        return firstLetter.toUpperCase() === firstLetter && restOfWord.toLowerCase() === restOfWord;
      });

      newText = newText.replace(/\b(\w+)\b/g, (match, word) => {
        if (word.toUpperCase() === word || conjunctions.indexOf(word.toLowerCase()) !== -1) {
          return word;
        } else {
          return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
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
      } else if (TitleCase) {
  
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

      const allUppercase = newText.split(' ').every(word => word.toUpperCase() === word);


      // Define the regular expression pattern to match the beginning of sentences
      let titleCaseCount = 0; // Initialize a counter for title case words

      newText.split(' ').every(word => {
        const firstLetter = word.charAt(0);
        const restOfWord = word.slice(1);
        // Check if the word has title case
        if (firstLetter.toUpperCase() === firstLetter && restOfWord.toLowerCase() === restOfWord) {
          titleCaseCount++; // Increment the title case word count
          return true;
        } else {
          return false;
        }
      });
      //console.log(titleCaseCount);

      if (allUppercase) {
        newText = newText.toLowerCase().charAt(0).toUpperCase() + newText.slice(1).toLowerCase();
        //console.log("allUppercase true");

      }
      else if (titleCaseCount >= 2) {
        newText = newText.toLowerCase().replace(/(^|[.!?]\s+)(\w+)/g, firstLetter => firstLetter.charAt(0).toUpperCase() + firstLetter.slice(1).toLocaleLowerCase());
      } else {
        // Define the regular expression pattern to match the beginning of sentences
        const sentenceRegex = /(^|[.!?]\s+)(\w+)/g;

        // Replace the matched patterns with capitalized letters
        newText = newText.replace(sentenceRegex, (match, boundary, word) => {
          // Check if the word is an acronym (all uppercase), if so, keep it as it is
          const isAcronym = word.length > 1 && word.toUpperCase() === word;
          if (isAcronym) {
            return boundary + word; // Keep the acronym as it is
          } else {
            return boundary + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Convert to Sentence Case
          }
        });
      }

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
      node.characters = node.characters.replace(/\. ?([a-z]|[A-Z])/g, '.\n$1');
      node.characters = node.characters.replace(/(^\w|\. ?\w)/gm, (match) => {
        return match.toUpperCase();
      });
      // Add a line break after a full stop followed by an optional space and uppercase letter
      figma.notify('Tadaannn... 🥁 Your Text now has line breaks after Fullstop.');
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
