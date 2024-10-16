// Detect user activity and notify the background script
document.addEventListener('mousemove', () => {
  chrome.runtime.sendMessage({ activityDetected: true });
  console.log("mouse");
});

document.addEventListener('keydown', () => {
  chrome.runtime.sendMessage({ activityDetected: true });
  console.log("keybord");

});

// Scroll down by 30% when this script is injected into an active tab
document.addEventListener('DOMContentLoaded', () => {
  let scrollAmount = document.body.scrollHeight * 0.4; // 30% of the page height
  window.scrollBy(0, scrollAmount);
});
