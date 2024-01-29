//opening edit model
$(document).ready(function () {
  // Handle double-click on the card
  $('#clickable').on('dblclick', function () {
      // Extract the ID from the clicked card
      var cardId = $(this).find('.card-id span').text();

      // Update the modal content with the ID
      $('#modalCardId').text(cardId);

      // Show the modal
      $('#editCardModal').modal('show');
  });
});

// main.js
import { database } from "./config.js";

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
            <h6 class="card-id">#${data.Itmid}</h6>
            <h5 class="card-title">${data.Itmnm}</h5>
            <p class="card-text"><i class="bi bi-clock"></i> ${data.edtime}</p>
          </div>
        </div>
        <div class="col-md-4">
          <img src="${data.Itmimg}" class="rounded-start card-img" alt="Card Image">
        </div>
      </div>
      <div class="conatiner card-footer justify-content-center">
        <!-- Add other card details based on your data -->
      </div>
    `;

    return card;
  }

  // Function to fetch data from Firebase
  function fetchDataFromFirebase() {
    const itemsRef = ref(database, 'Items');

    onValue(itemsRef, (snapshot) => {
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
  }

  // Call the function to fetch data
  fetchDataFromFirebase();
});

