const amenityIDs = new Map();
$(_ => {
  checkAPIStatus();
  showSelectedAmenities();
  const url = 'http://0.0.0.0:5001/api/v1/places_search';
  const data = JSON.stringify({
    amenities: Array.from(amenityIDs.keys())
  });
  const ajaxSettings = {
    url: url,
    crossDomain: true,
    type: 'POST',
    contentType: 'application/json',
    data: data,
    success: populatePlace
  };
  $.post(ajaxSettings);

  // Add click listener on search button
  $('button').on('click', _ => {
    $('.places').empty();
    getPlace({ amenities: Array.from(amenityIDs.keys()) }, populatePlace);
  });
});

function checkAPIStatus () {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    }
  });
}

function showSelectedAmenities () {
  // Select all amenities checkboxes; Listen for checks
  $('div.amenities div.popover ul li input').change(function (event) {
    if (this.checked) {
      amenityIDs.set(this.dataset.id, this.dataset.name);
    } else {
      amenityIDs.delete(this.dataset.id);
    }
    let text = Array.from(amenityIDs.values()).join(', ');
    if (text.length === 0) {
      // Use a non-breaking space as a placeholder to maintain document format
      text = '&nbsp;';
    }
    // Update the text of the <h4> showing selected amenities
    $('div.amenities h4').html(text);
  });
}

function populatePlace (data) {
  data.forEach(place => {
    // first div
    const articleNode = document.createElement('ARTICLE');
    let outerDiv = document.createElement('DIV');
    const placeNameH2 = document.createElement('H2');
    let innerDiv = document.createElement('DIV');
    placeNameH2.appendChild(document.createTextNode(place.name));
    innerDiv.appendChild(document.createTextNode('$' + place.price_by_night));
    outerDiv.appendChild(placeNameH2);
    outerDiv.appendChild(innerDiv);
    articleNode.appendChild(outerDiv);
    outerDiv.classList.add('title_box');
    innerDiv.classList.add('price_by_night');
    // Information div
    // guests
    outerDiv = document.createElement('DIV');
    innerDiv = document.createElement('DIV');
    innerDiv.classList.add('max_guest');
    const guest = place.max_guest !== 1 ? 'Guests' : 'Guest';
    innerDiv.appendChild(document.createTextNode(guest + ' ' + place.max_guest));
    outerDiv.appendChild(innerDiv);
    // rooms
    innerDiv = document.createElement('DIV');
    innerDiv.classList.add('number_rooms');
    const room = place.max_guest !== 1 ? 'Rooms' : 'Room';
    innerDiv.appendChild(document.createTextNode(room + ' ' + place.number_rooms));
    outerDiv.appendChild(innerDiv);
    // bathrooms
    innerDiv = document.createElement('DIV');
    innerDiv.classList.add('number_bathrooms');
    const bathroom = place.max_guest !== 1 ? 'Bathrooms' : 'Bathroom';
    innerDiv.appendChild(document.createTextNode(bathroom + ' ' + place.number_bathrooms));
    outerDiv.appendChild(innerDiv);

    outerDiv.classList.add('information');
    articleNode.appendChild(outerDiv);
    // description div
    outerDiv = document.createElement('DIV');
    outerDiv.classList.add('description');
    outerDiv.insertAdjacentHTML('beforeend', place.description);
    articleNode.appendChild(outerDiv);

    $('.places')[0].appendChild(articleNode);
  });
}

// Request the API to load data from the front end
function getPlace (filters, successCallBack) {
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    crossDomain: true,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(filters),
    success: successCallBack,
    error: function () {
      console.log('Cannot get data');
    }
  });
}
