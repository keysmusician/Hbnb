// $(_ => {
//   checkAPIStatus();
//   const url = API_root + 'places_search';
//   const amenity_JSON = JSON.stringify({
//     amenities: Array.from(selected_amenities.keys())
//   });
//   const ajaxSettings = {
//     url: url,
//     crossDomain: true,
//     type: 'POST',
//     contentType: 'application/json',
//     data: amenity_JSON,
//     success: populatePlace
//   };
//   //$.post(ajaxSettings);

//   // Add click listener on search button
//   $('#static_search_button').on('click', _ => renderSearch(selected_category));
// });

export function renderSearch(selected_category) {
  const filters = {
    amenities: $("input[name='amenities']:checked").map(
      function () { return this.value; }).get(),
    cities: Array.from(selected_cities.keys()),
    price_min: $('#price_min').val(),
    price_max: $('#price_max').val(),
    category: selected_category
  };
  searchPlaces(filters);
}

function checkAPIStatus() {
  $.get(API_root + 'status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status')
        .addClass('available')
        .prop('title', 'API status: available');
    }
  });
}

function populatePlace(data) {
  $('#places').empty();

  data.forEach(place => {

    const places_html = `
      <a href="/places/${place.id}">
        <article>
          <div class="title_box">
            <h2>${place.name}</h2>
          </div>
          <div class="city">
            <b>${place.city?.name}, ${place.state?.name}</b>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_rooms != 1 ? 's' : ''}</div>
          </div>
          <div class="description">
            ${place.description}
          </div>
          <div class="price_by_night">
            <b>\$${place.price_by_night}</b> night
          </div>
        </article>
      </a>
      `

    $('#places').append(places_html);
  });
}

export function searchPlaces(filters) {
  $.post({
    url: API_root + 'places_search',
    crossDomain: true,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(filters),
    success: populatePlace,
    error: function () {
      console.log('Cannot get data');
    }
  });
}
