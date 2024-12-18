$(document).ready(function() {
  const $itemsList = $('#items-list');
  const $itemName = $('#item-name');
  const $itemPrice = $('#item-price');

  function fetchItems() {
    $.get('/items', function(items) {
      $itemsList.empty();
      items.forEach(item => {
        if (item.name && item.price !== undefined) {
          $itemsList.append(
            `<li class="list-group-item d-flex justify-content-between align-items-center">
              ${item.name} - $${item.price}
              <button class="btn btn-danger btn-sm delete-item" data-name="${item.name}">Delete</button>
            </li>`
          );
        }
      });
    });
  }

  $('#add-item-form').on('submit', function(event) {
    event.preventDefault();
    const newItem = {
      name: $itemName.val(),
      price: parseFloat($itemPrice.val())
    };
    // Add console log to inspect the newItem object
    console.log("New Item:", newItem);
    $.ajax({
      type: 'POST',
      url: '/items',
      data: JSON.stringify(newItem),
      contentType: 'application/json',
      success: function(data) {
        fetchItems();
        $itemName.val('');
        $itemPrice.val('');
      },
      error: function(xhr, status, error) {
        console.error('Error adding item:', error);
      }
    });
  });

  $itemsList.on('click', '.delete-item', function() {
    const itemName = $(this).data('name');
    $.ajax({
      url: `/items/${itemName}`,
      type: 'DELETE',
      success: function(result) {
        fetchItems();
      },
      error: function(xhr, status, error) {
        console.error('Error deleting item:', error);
      }
    });
  });

  fetchItems();
});
