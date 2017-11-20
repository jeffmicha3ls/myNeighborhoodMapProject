var map;

function initMap() {

  // Create a styles array to use with the map.
  var styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    }
  ];

  // Creating new map in north Seattle area
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.7853000, lng: -122.2988500},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });
  ko.applyBindings(new ViewModel());

};
