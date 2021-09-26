const $ = window.$;
$(_ => {
  checkAPIStatus();
  showSelectedAmenities();
});

function checkAPIStatus () {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    }
  });
}

function showSelectedAmenities () {
  const amenityIDs = new Map();
  // Select all amenities checkboxes; Listen for checks
  $('div.amenities div.popover ul li input').change(function (event) {
    if (this.checked) {
      amenityIDs.set(this.dataset.id, this.dataset.name);
    } else {
      amenityIDs.delete(this.dataset.id);
    }
    let text = Array.from(amenityIDs.values()).join(', ');
    // Truncate long text
    if (text.length > 37) {
      text = text.substring(0, 37) + '...';
    } else if (text.length === 0) {
      // Use a non-breaking space as a placeholder to maintain document format
      text = '&nbsp;';
    }
    // Update the text of the <h4> showing selected amenities
    $('div.amenities h4').html(text);
  });
}
