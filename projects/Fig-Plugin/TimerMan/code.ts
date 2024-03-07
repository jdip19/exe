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

interface TimerData {
  start: number;
  end: number;
  duration: number;
}


function saveTimerData(start: number, end: number, duration: number) {
  const key = 'timerData';
  const data = { start, end, duration };

  figma.clientStorage.getAsync(key).then((existingData: TimerData[]) => {
    const newData = existingData || []; // Initialize as empty array if no data found
    newData.push(data);
  
    // Save updated timer data to client storage
    figma.clientStorage.setAsync(key, newData).then(() => {
      console.log('Timer data saved:', newData);
      downloadTimerDataAsJSON(newData); // Download timer data as JSON
    }).catch(err => {
      console.error('Error saving timer data:', err);
    });
  }).catch(err => {
    console.error('Error retrieving timer data:', err);
  });
}



function downloadTimerDataAsJSON(data: TimerData[]) {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'timer_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up
  URL.revokeObjectURL(url);
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
