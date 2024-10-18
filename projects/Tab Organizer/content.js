// Listen for mouse movements and key presses
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keydown', resetInactivityTimer);

// Function to send a message to the background script
function resetInactivityTimer() {
  if (chrome && chrome.runtime) {
    chrome.runtime.sendMessage({ action: "resetInactivityTimer" });
  } else {
    console.error("chrome.runtime is not available.");
  }
}
