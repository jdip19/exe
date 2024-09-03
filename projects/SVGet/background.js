chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getHTML
    });
  });
  
  function getHTML() {
    const htmlContent = document.documentElement.outerHTML;
    chrome.storage.local.set({ htmlContent }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving HTML content:", chrome.runtime.lastError);
      } else {
        console.log("HTML content saved successfully.");
      }
    });
  }
  