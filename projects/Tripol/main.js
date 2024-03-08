

// Define API endpoint and form elements
let api = "https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbzm69nT_c9cEpmQvkdy-2MIIqsIwoiEhkNKHTrK7e4kkoT1HLTKJ4tOrMEBZxzdcj3I5w/exec";

let form = document.getElementById("addSpending");
let paidBy = document.getElementById("paidBy");
let paid = document.getElementById("paid");
let saveAndClose = document.getElementById("saveAndClose");

// Add event listener to the "Add Bill" button
saveAndClose.addEventListener("click", addData);

// Function to add data
function addData() {
  // Change the text content of the add button to indicate that data is being added
  saveAndClose.textContent = "Adding..";

  // Retrieve paid by and paid amount
  let paidAmount = parseFloat(paid.value);

  // Retrieve involved persons
  let involvedPersons = [];
  document.querySelectorAll('#involved input[type="checkbox"]:checked').forEach(function (checkbox) {
    involvedPersons.push(checkbox.value);
  });

  // Calculate share
  let share = paidAmount / involvedPersons.length;

  // Create an object with the bill information
  let obj = {
    bill: {
      paidBy: paidBy.value,
      paidAmount: paidAmount,
      share: share,
      involvedPersons: involvedPersons
    }
  };
  console.log(obj);
  // Use fetch to make a POST request to the API endpoint with the JSON stringified obj as the request body
  fetch(api, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json"
    }
  })

    // Parse the response text from the server and handle accordingly
    .then(res => res.text())
    .then(data => {
      // Show an alert with the response message from the server
      alert(data);
      // Reset the form and change the text content of the add button back to its original state
      saveAndClose.textContent = "Add Bill";
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while adding the bill.');
      saveAndClose.textContent = "Add Bill";
    });
}



document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector(".list");
  const searchInput = document.getElementById("searchInput");
  let currentTime = new Date().getTime() / 1000;



  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();
    filterCards(searchText);
  });
  searchInput.addEventListener("input", function () {
    const searchText = this.value.trim().toLowerCase();
    filterCards(searchText);
  });

  $(document).on("click", "#addItem", function () {
    // Assuming itemRef is the reference to the 'Items' collectio
    //const wantToAddItem = window.confirm("Want to add an item?");
    //footerData();


    let uniqID = 1;
    while (existingIds.includes(uniqID)) {
      uniqID++;
    }
    $("#editCardModal").modal("show");
    $("#modalCardId").text(uniqID);
    $("#modal-title").text("Adding");
    $("#edTime").text(formatCustomDateTime(currentTime));
    var addModel = new bootstrap.Modal(document.getElementById('editCardModal'));
    addModel.hide();

    // $("").val("Item Name");
    // $("").val(100);
  });





  $(document).on("dblclick", "#clickable", function () {
    const ModelcardId = $(this).find("#itmid").text();

    $("#modalCardId").text(ModelcardId);
    $("#modal-title").text("Editing");
    $("#editCardModal").modal("show");

    const cardId = $("#modalCardId").text();

    const itemRef = child(itemsRef, "/" + cardId);
    fetchDataForCard(itemRef);

    $(document).on("click", "#saveAndClose", function () {
      handleSaveAndClose(itemRef, cardId);
    });
    $(document).on("click", "#removeItm", function () {
      removeItm(itemRef, cardId);
    });
  });

  // Function to handle custom price input

  fetchDataFromSheet();

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

  // Function to handle save and close button click


  const existingIds = [];




  function fetchDataFromSheet() {
    // onValue(itemsRef, (snapshot) => {
    //   items = snapshot.val(); // Update the global 'items'
    //   cardsContainer.innerHTML = ""; // Clear existing cards
    //   existingIds.length = 0; // Clear existingIds array

    //   if (items) {
    //     Object.keys(items).forEach((itemId) => {
    //       existingIds.push(parseInt(itemId));
    //       const cardData = items[itemId];
    //       const card = createCard(cardData, itemId);
    //       cardsContainer.appendChild(card); // Append the card to the container
    //     });

    //     showToast(
    //       "Total " + existingIds.length + " items available",
    //       "primary"
    //     );
    //   } else {
    //     showToast(
    //       "No data available. Please check your network connection.",
    //       "warning"
    //     );
    //   }
    // });
  }
  function filterCards(searchText) {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const cardId = card.querySelector(".card-id").textContent.toLowerCase();
      const cardItemNameEng = card
        .querySelector("#itmNmEng")
        .textContent.toLowerCase();
      const cardItemNameGuj = card
        .querySelector("#itmNmGuj")
        .textContent.toLowerCase();

      // Check if the English or Gujarati item name contains the search text
      const englishMatch = cardItemNameEng.includes(searchText);
      const gujaratiMatch = cardItemNameGuj.includes(searchText);

      card.style.display =
        searchText === "" ||
          englishMatch ||
          gujaratiMatch ||
          cardId.includes(searchText)
          ? "block"
          : "none";
    });
  }
  // function updateModalElements(data) {
  //   $("#edTime").text(formatCustomDateTime(data.edtime));
  //   $("#itmImg").attr("src", data.itmimg);
  //   $("#itmNmguj").val(data.itmnmguj);
  //   $("#itmNm").val(data.itmnm);
  //   $("#ippKg").val(data.ppkg);
  // }

  // function handleSaveAndClose(itemRef, cardId) {
  //   // Check if $('#itmImg').val() is defined before updating itmimg
  //   const itmimgValue = $("#itmImg").attr("src");
  //   if (typeof itmimgValue !== "undefined") {
  //     update(itemRef, {
  //       itmimg: itmimgValue,
  //       itmnmguj: $("#itmNmguj").val(),
  //       itmnm: $("#itmNm").val(),
  //       ppkg: $("#ippKg").val(),
  //       edtime: currentTime,
  //     })
  //       .then(() => {
  //         showToast(cardId + " Updated Succesfully", "primary");
  //       })
  //       .catch((error) => {
  //         alert("Error updating data: " + error);
  //       });
  //   } else {
  //     alert("itmimg value is undefined. Cannot perform update.");
  //   }
  // }

  // function removeItm(itemRef, cardId) {
  //   remove(itemRef)
  //     .then(() => {
  //       showToast("Card #" + cardId + " Deleted", "danger");
  //       // setTimeout(() => {
  //       //   location.reload();
  //       // }, 3000);
  //     })
  //     .catch((error) => {
  //       alert("Error updating data: " + error);
  //     });
  // }
  //   function footerData() {
  //     const modalFooterData = `<div class="p-w-box">
  //     <div class="cusPriceDiv">₹<input id="cusPrice" class="cusPrice form-control" type="number" placeholder="₹" value="10"></div>
  //     <div class="weight" id="weight">${Math.round((1000 / 100) * 10)}gm</div>
  // </div>
  //   <div class="p-w-box">
  //       <div class="price">₹<span id="price250">${100 / 4}</span></div>
  //       <div class="weight" id="weight250">250gm</div>
  //   </div>
  //   <div class="p-w-box">
  //       <div class="price">₹<span id="price500">${100 / 2}</span></div>
  //       <div class="weight" id="weight500">500gm</div>
  //   </div>`;

  //     $("#modalFooter").html(modalFooterData);
  //   }



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
  function showToast(message, color) {
    // Select the toast container
    const toastContainer = document.getElementById("toastPlacement");

    // Create a new toast element
    const toast = document.createElement("div");
    toast.classList.add(
      "toast",
      "d-flex",
      "p-2",
      "justify-content-between",
      `bg-${color}`
    );
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
