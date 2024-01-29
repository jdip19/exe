import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, on } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDYF1MoFUCozgh6PfsH-nM1avUTbxSM_rY",
  authDomain: "my-store-11-6b8f5.firebaseapp.com",
  databaseURL:"https://my-store-11-6b8f5-default-rtdb.firebaseio.com",
  projectId: "my-store-11-6b8f5",
  storageBucket: "my-store-11-6b8f5.appspot.com",
  messagingSenderId: "719774944841",
  appId: "1:719774944841:web:9ac216f8ffb2e49bcc7998"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector('.list');

  // Function to create a card element
  function createCard(data) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Add your card structure here based on the data
    // Example:
    card.innerHTML = `
      <div class="row g-0 align-items-center">
        <div class="col-md-8">
          <div class="card-body">
            <h6 class="card-id">#${data.itmid}</h6>
            <h5 class="card-title">${data.itmnm}</h5>
            <p class="card-text"><i class="bi bi-clock"></i> ${data.edtime}</p>
          </div>
        </div>
        <div class="col-md-4">
          <img src="${data.itmimg}" class="rounded-start card-img" alt="Card Image">
        </div>
      </div>
      <div class="conatiner card-footer justify-content-center">
        <!-- Add other card details based on your data -->
      </div>
    `;

    return card;
  }

  const itemsRef = ref(database, 'Items');

  on(itemsRef, 'value', (snapshot) => {
    const items = snapshot.val();

    // Clear existing cards
    cardsContainer.innerHTML = '';

    // Iterate through each item and create a card
    for (const itemId in items) {
      const cardData = items[itemId];
      const card = createCard(cardData);

      // Append the card to the container
      cardsContainer.appendChild(card);
    }
  });
});
