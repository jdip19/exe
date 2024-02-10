import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  update,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYF1MoFUCozgh6PfsH-nM1avUTbxSM_rY",
  authDomain: "my-store-11-6b8f5.firebaseapp.com",
  databaseURL: "https://my-store-11-6b8f5-default-rtdb.firebaseio.com",
  projectId: "my-store-11-6b8f5",
  storageBucket: "my-store-11-6b8f5.appspot.com",
  messagingSenderId: "719774944841",
  appId: "1:719774944841:web:9ac216f8ffb2e49bcc7998",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const itemsRef = ref(database, "Items");

document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector(".list");
  const searchInput = document.getElementById("searchInput");

  const modeldiv = document.getElementById("modal-body");

  // Function to create a card element
  function createCard(data, itemId) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-8">
                    <div id="clickable" class="card-body">
                        <h6 class="card-id">#<span id="itmid">${itemId}</span></h6>
                        <h5 class="card-title">${data.itmnm}</h5>
                        <p class="card-text"><i class="bi bi-clock"></i> ${formatCustomDateTime(
                          data.edtime
                        )}</p>
                        </div>
                        </div>
                <div class="col-md-4">
                    <img src="${
                      data.itmimg
                    }" class="rounded-start card-img" alt="Card Image">
                </div>
            </div>
            <div class="container card-footer">
                <div class="p-w-box">
                    <div class="cusPriceDiv">₹<input id="cusPrice" class="cusPrice form-control" type="number" placeholder="₹" value="10"></div>
                    <div class="weight" id="weight">${Math.round(
                      (1000 / data.ppkg) * 10
                    )}gm</div>
                </div>
                <div class="p-w-box">
                    <div class="price">₹<span id="price2">${
                      data.ppkg / 4
                    }</span></div>
                    <div class="weight" id="weight250">250gm</div>
                </div>
                <div class="p-w-box">
                    <div class="price">₹<span id="price3">${
                      data.ppkg / 2
                    }</span></div>
                    <div class="weight" id="weight500">500gm</div>
                </div>
                <div class="p-w-box">
                    <div class="price">₹<span id="price4">${
                      data.ppkg
                    }</span></div>
                    <div class="weight" id="weight1">1kg</div>
                </div>
            </div>
               `;

    // Event listener for the .cusPrice input within the dynamically created card
    card.querySelector("#cusPrice").addEventListener("input", function () {
      handleCustomPriceInput(this, data);
    });

    return card;
  }
  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();
    filterCards(searchText);
  });
  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();
    filterCards(searchText);
  });

  $(document).on("dblclick", "#clickable", function () {
    const ModelcardId = $(this).find("#itmid").text();
    $("#modalCardId").text(ModelcardId);
    $("#editCardModal").modal("show");

    const cardId = $("#modalCardId").text();

    const itemRef = child(itemsRef, "/" + cardId);
    fetchDataForCard(itemRef);
    console.log(ModelcardId);
    console.log(cardId);

    $(document).on("click", "#saveAndClose", function () {
      handleSaveAndClose(cardId);
    });
    $(document).on("click", "#removeItm", function () {
      removeItm(itemRef, cardId);
    });
  });

  // Function to handle custom price input
  function handleCustomPriceInput(inputElement, data) {
    const customPrice = parseFloat(inputElement.value);
    const weightElement = inputElement
      .closest(".card")
      .querySelector(".weight");

    if (!isNaN(customPrice)) {
      const weightValue = Math.round((1000 / data.ppkg) * customPrice);
      weightElement.textContent = weightValue + "gm";
    } else {
      console.log("Invalid input for customPrice");
    }
  }
  fetchDataFromFirebase();

  function fetchDataForCard(itemRef) {
    get(itemRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          updateModalElements(data);
        } else {
          console.warn("No data found for card " + cardId);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  // Function to update modal elements with fetched data
  function updateModalElements(data) {
    $("#edTime").text(formatCustomDateTime(data.edtime));
    $("#itmImg").attr("src", data.itmimg);
    $("#itmNm").val(data.itmnm);
    $("#ippKg").val(data.ppkg);
  }
  let copiedContent; // Define the variable globally

  $(document).ready(function () {
    $("#itmImg").on("dblclick", function () {
      navigator.clipboard
        .readText()
        .then(function (content) {
          copiedContent = content; // Set the global variable
          $("#itmImg").attr("src", copiedContent);
        })
        .catch(function (err) {
          console.error("Failed to read clipboard content: ", err);
        });
    });
  });

  // Function to handle save and close button click
  function handleSaveAndClose(cardId) {
    const itemRef = child(itemsRef, "/" + cardId);

    // Check if $('#itmImg').val() is defined before updating itmimg
    const itmimgValue = $("#itmImg").attr("src");
    if (typeof itmimgValue !== "undefined") {
      update(itemRef, {
        itmimg: itmimgValue,
        itmnm: $("#itmNm").val(),
        ppkg: $("#ippKg").val(),
        edtime: new Date().getTime() / 1000,
      })
        .then(() => {
          showToast(cardId + " Updated Succesfully");
        })
        .catch((error) => {
          alert("Error updating data: " + error);
        });
    } else {
      alert("itmimg value is undefined. Cannot perform update.");
    }
  }

  let items = [];
  const existingIds = [];
  let lastCount;

  function fetchDataFromFirebase() {
    onValue(itemsRef, (snapshot) => {
      items = snapshot.val(); // Update the global 'items'
      cardsContainer.innerHTML = ""; // Clear existing cards

      Object.keys(items).forEach((itemId) => {
        lastCount = Object.keys(snapshot.val()).length;
        existingIds.push(parseInt(itemId));
        const cardData = items[itemId];
        const card = createCard(cardData, itemId);
        cardsContainer.appendChild(card); // Append the card to the container
      });
    });
  }

  function filterCards(searchText) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const cardTitle = card
        .querySelector(".card-title")
        .textContent.toLowerCase();
      const cardId = card.querySelector(".card-id").textContent.toLowerCase();

      card.style.display =
        searchText === "" ||
        cardTitle.includes(searchText) ||
        cardId.includes(searchText)
          ? "block"
          : "none";
    });
  }

  function removeItm(itemRef, cardId) {
    console.log(cardId);
    remove(itemRef)
      .then(() => {
        showToast("Card " + cardId + " Deleted");
        setTimeout(() => {
          location.reload();
        }, 3000);
      })
      .catch((error) => {
        alert("Error updating data: " + error);
      });
  }

  $(document).on("click", "#addItem", function () {
    // Assuming itemRef is the reference to the 'Items' collectio
    const wantToAddItem = window.confirm("Want to add an item?");

    if (wantToAddItem) {
      let uniqID = 1;
      while (existingIds.includes(uniqID)) {
        uniqID++;
      }

      set(child(itemsRef, uniqID.toString()), {
        // Use child() to create a reference to the specific child
        itmimg: "https://cdn.kibrispdr.org/data/657/image-icon-png-0.jpg",
        itmnm: "વસ્તુ નુ નામ ",
        ppkg: 100,
        edtime: new Date().getTime() / 1000,
      })
        .then(() => {
          location.reload();
        })
        .catch((error) => {
          alert("Error updating data: " + error);
        });
    } else {
      console.log("Not Want to");
    }
  });

  function formatCustomDateTime(timestamp) {
    const options = {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const dateObject = new Date(timestamp * 1000);
    return dateObject.toLocaleString("en-GB", options);
  }
  function showToast(message) {
    // Select the toast container
    const toastContainer = document.getElementById("toastPlacement");

    // Create a new toast element
    const toast = document.createElement("div");
    toast.classList.add("toast", "d-flex", "p-2", "justify-content-between");
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    // Create a div for the toast body and add the message
    const toastBody = document.createElement("div");
    toastBody.classList.add("toast-body", "p-0");
    toastBody.textContent = message;

    // Create a button to dismiss the toast
    const closeButton = document.createElement("button");
    closeButton.setAttribute("type", "button");
    closeButton.classList.add("btn-close");
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");

    // Append the toast body and close button to the toast element
    toast.appendChild(toastBody);
    toast.appendChild(closeButton);

    // Append the toast element to the toast container
    toastContainer.appendChild(toast);

    // Show the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  }
});
