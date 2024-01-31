// Use event delegation to handle the double-click event
$(document).on('dblclick', '#clickable', function () {
  // Extract the ID from the clicked card
  var cardId = $(this).find('#itmid').text();

  // Update the modal content with the ID
  $('#modalCardId').text(cardId);

  // Show the modal
  $('#editCardModal').modal('show');
});

// Assuming you have this modal structure in your HTM
