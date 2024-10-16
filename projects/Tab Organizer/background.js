let inactivityTime = 10000;  // 1 minute in milliseconds
let timeout;

function startInactivityTimer() {
  timeout = setTimeout(selectRandomTab, inactivityTime);
}
console.log("out",inactivityTime);

function resetInactivityTimer() {
  console.log("reset",inactivityTime);
  clearTimeout(timeout);
  startInactivityTimer();
}

// Monitor mouse and keyboard activity across all tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.activityDetected) {
    resetInactivityTimer();
  }
});

// Function to select a random tab and switch to it
function selectRandomTab() {
  chrome.tabs.query({}, function(tabs) {
    let randomIndex = Math.floor(Math.random() * tabs.length);
    let selectedTab = tabs[randomIndex];
    
    chrome.tabs.update(selectedTab.id, { active: true }, () => {
      chrome.scripting.executeScript({
        target: { tabId: selectedTab.id },
        files: ['content.js']
      });
    });
  });
}

// Start the inactivity timer when the extension loads
startInactivityTimer();
