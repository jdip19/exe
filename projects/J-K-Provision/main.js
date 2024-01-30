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

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYF1MoFUCozgh6PfsH-nM1avUTbxSM_rY",
  authDomain: "my-store-11-6b8f5.firebaseapp.com",
  databaseURL: "https://my-store-11-6b8f5-default-rtdb.firebaseio.com",
  projectId: "my-store-11-6b8f5",
  storageBucket: "my-store-11-6b8f5.appspot.com",
  messagingSenderId: "719774944841",
  appId: "1:719774944841:web:9ac216f8ffb2e49bcc7998"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase,ref,get,set,child,update,remove } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const db = getDatabase();

var edTime=document.getElementById("edtime")

function readData()
{
    const dbref =ref(db);

    get(child(dbref,"Items/"+1)).then((snapshot)=>{
        if(snapshot.exists()){
            edTime.innerHTML=snapshot.val().edtime;
        }
        else{
            alert("data not found");
        }
    })
    .catch((error)=>{
        alert("error occured"+error);
    })

}
   

// Initialize Firebase
const database = getDatabase();

// Get a reference to the database service


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
});

  const itemsRef = ref(database, 'Items');

  onValue(itemsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const items = snapshot.val();
      cardsContainer.innerHTML = '';

    // Iterate through each item and create a card
    for (const itemId in items) {
      const cardData = items[itemId];
      const card = createCard(cardData);

      // Append the card to the container
      cardsContainer.appendChild(card);
    }
    });
  }, {
    onlyOnce: true
  });
  
