let inactivityTime = 10000; // 1 minute in milliseconds
let timeout;

// Function to simulate cursor movement
function randomCursorMovement() {
  const cursor = document.createElement("div");
  cursor.style.position = "absolute";
  cursor.style.width = "10px"; // Size of the cursor
  cursor.style.height = "10px";
  cursor.style.border = "1px solid red"; // Optional: visible indicator
  cursor.style.pointerEvents = "none"; // Make sure it doesn't block interactions
  document.body.appendChild(cursor);

  const randomX = Math.random() * (window.innerWidth - 10); // 10 is the cursor size
  const randomY = Math.random() * (window.innerHeight - 10); // 10 is the cursor size

  // Move the cursor to a random position
  cursor.style.left = `${randomX}px`;
  cursor.style.top = `${randomY}px`;

  // Remove the cursor after a short delay (optional)
  setTimeout(() => {
    cursor.remove();
  }, 1000); // Adjust this value to how long you want it to stay
}

// Start inactivity timer when the service worker is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Service worker registered successfully');
  startInactivityTimer();
});

// Function to handle inactivity
function startInactivityTimer() {
  timeout = setTimeout(moveCursorRandomly, inactivityTime);
}

// Function to reset inactivity timer
function resetInactivityTimer() {
  clearTimeout(timeout);
  startInactivityTimer();
}

// Function to move cursor randomly
function moveCursorRandomly() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs && tabs.length > 0) {
      let selectedTab = tabs[0];
      if (selectedTab && selectedTab.url) {
        if (!selectedTab.url.startsWith("chrome://") && !selectedTab.url.startsWith("chrome-extension://")) {
          try {
            chrome.scripting.executeScript({
              target: { tabId: selectedTab.id },
              function: randomCursorMovement
            });
          } catch (error) {
            console.error("Error executing script:", error);
          }
        } else {
          console.log("Cannot interact with this URL:", selectedTab.url);
        }
      }
    }
  });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetInactivityTimer") {
    resetInactivityTimer();
  }
});
