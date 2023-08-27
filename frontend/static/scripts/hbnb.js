$(_ => {
  checkAPIStatus();
});

function checkAPIStatus() {
  $.get('api/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status')
        .addClass('available')
        .prop('title', 'API status: available');
    }
  });
}
