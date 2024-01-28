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

