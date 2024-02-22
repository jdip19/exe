figma.showUI(__html__);
figma.ui.resize(300, 300);

let timerRunning = false;
let startTime: number;
let endTime: number;

figma.ui.onmessage = msg => {
  if (msg.type === 'toggleTimer') {
    if (timerRunning) {
      // Stop timer
      timerRunning = false;
      endTime = Date.now();
      const duration = endTime - startTime;
      saveTimerData(startTime, endTime, duration);
      figma.notify(`Timer stopped. Duration: ${formatTime(duration)}`);
    } else {
      // Start timer
      timerRunning = true;
      startTime = Date.now();
      figma.notify("Timer started");
    }
  }
};

function saveTimerData(start: number, end: number, duration: number) {
  const timerData = { start, end, duration };
  const key = 'timerData'; // Use a unique key for storing timer data
  figma.clientStorage.setAsync(key, timerData).then(() => {
    console.log('Timer data saved:', timerData);
    formatAsCSV(data); // Save timer data as CSV
  }).catch(err => {
    console.error('Error saving timer data:', err);
  });
}

function formatAsCSV(data: TimerData[]): string {
  // Define the CSV header
  const headers = Object.keys(data[0]).join(',');

  // Format each row of data as a CSV line
  const rows = data.map(item => Object.values(item).join(','));

  // Combine the header and rows
  return `${headers}\n${rows.join('\n')}`;
}

function formatTime(ms: number): string {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const formatNumber = (num: number) => (num < 10 ? `0${num}` : num.toString());

  return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

// Function to load a specific HTML view
function loadView(view: string) {
  figma.ui.postMessage({ type: 'load-view', view });
}

// Load the initial view
loadView('textareaView');


// Load the initial view
// function sendTimerDataToSpreadsheet(timerData: any) {
//   const spradSheetUrl = "https://script.google.com/macros/s/AKfycbzbVbWMWelb-94lnrBYnf3SE2E2Ck4iqZyoX8CDq99cGR1hofXAAriJaoNTUYxBlBl4/exec";
  
//   // Convert the timer data to JSON string
//   const jsonData = JSON.stringify(timerData);

//   // Send a POST request to your Google Apps Script
//   fetch(spradSheetUrl, {
//     method: "POST",
//     body: jsonData,
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }).then(response => {
//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error("Failed to submit the form.");
//     }
//     return response.json();
//   }).then(data => {
//     console.log('Response from Google Apps Script:', data);
//   }).catch(error => {
//     console.error('Error submitting data:', error);
//   });
// }
loadView('textareaView');
