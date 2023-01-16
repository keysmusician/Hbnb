import { API_root } from './api_root.js'

const selected_amenities = new Map();

const selected_cities = new Map();

$(_ => {
  checkAPIStatus();
  selectAmenities();
  selectCities();
  const url = API_root + 'places_search';
  const amenity_JSON = JSON.stringify({
    amenities: Array.from(selected_amenities.keys())
  });
  const ajaxSettings = {
    url: url,
    crossDomain: true,
    type: 'POST',
    contentType: 'application/json',
    data: amenity_JSON,
    success: populatePlace
  };
  //$.post(ajaxSettings);

  // Add click listener on search button
  $('button').on('click', _ => {
    $('#places').empty();
    const filters = {
      amenities: Array.from(selected_amenities.keys()),
      cities: Array.from(selected_cities.keys())
    };
    searchPlaces(filters, populatePlace);
  });
});

function checkAPIStatus () {
  $.get(API_root + 'status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
      $('DIV#api_status').prop('title', 'API status: available');
    }
  });
}

function selectAmenities () {
  // Select all amenities checkboxes; Listen for checks
  $('div.amenities div.popover ul li input').change(function (event) {
    if (this.checked) {
      selected_amenities.set(this.dataset.id, this.dataset.name);
    } else {
      selected_amenities.delete(this.dataset.id);
    }
    let text = Array.from(selected_amenities.values()).join(', ');
    if (text.length === 0) {
      // Use a non-breaking space as a placeholder to maintain document format
      text = '&nbsp;';
    }
    // Update the text of the <h4> showing selected amenities
    $('div.amenities h4').html(text);
  });
}

function selectCities () {
  // Select all amenities checkboxes; Listen for checks
  $('div.locations div.popover ul li input').change(function (event) {
    if (this.checked) {
      selected_cities.set(this.dataset.id, this.dataset.name);
    } else {
      selected_cities.delete(this.dataset.id);
    }
    let text = Array.from(selected_cities.values()).join(', ');
    if (text.length === 0) {
      // Use a non-breaking space as a placeholder to maintain document format
      text = '&nbsp;';
    }
    // Update the text of the <h4> showing selected amenities
    $('div.locations h4').html(text);
  });
}

function populatePlace (data) {
  data.forEach(place => {
    const places_html = `
      <a href="/places/${ place.id }">
        <article>
          <div class="title_box">
            <h2>${ place.name }</h2>
          </div>
          <div class="city">
            <b>${ place.city.name }, ${ place.state.name }</b>
          </div>
          <div class="information">
            <div class="max_guest">${ place.max_guest } Guest${ place.max_guest != 1 ? 's' : '' }</div>
            <div class="number_rooms">${ place.number_rooms } Bedroom${ place.number_rooms != 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${ place.number_bathrooms } Bathroom${ place.number_rooms != 1 ? 's' : ''}</div>
          </div>
          <div class="description">
            ${ place.description }
          </div>
          <div class="price_by_night">
            <b>\$${ place.price_by_night }</b> night
          </div>
        </article>
      </a>
      `

    $('#places').append(places_html);
  });
}

function searchPlaces (filters, successCallBack) {
  $.post({
    url: API_root + 'places_search',
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
