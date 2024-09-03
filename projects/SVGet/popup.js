document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('htmlContent', (data) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving HTML content:", chrome.runtime.lastError);
      document.getElementById('htmlContent').value = 'Error retrieving content.';
    } else {
      const htmlContent = data.htmlContent || 'No HTML content available';
      document.getElementById('htmlContent').value = htmlContent;
    }
  });
});
