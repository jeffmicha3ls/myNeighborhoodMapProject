var map;
// Create a new blank array for all the listing markers.
var markers = [];

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

  // Creating new map of coffee shops in north Seattle suburbs
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.7841000, lng: -122.3182000},
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });

  // These are the listing marker icons.
  var defaultIcon = makeMarkerIcon('1B965E');
  var highlightedIcon = makeMarkerIcon('F71313');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var id = locations[i].id;
    // Create a marker per location
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      defaultIcon: defaultIcon,
      highlightedIcon: highlightedIcon,
      id: locations[i].id
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    var newInfoWindow = new google.maps.InfoWindow();
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      makeInfoWindow(this, newInfoWindow);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      var self = this;
      self.setAnimation(google.maps.Animation.BOUNCE);
      this.setIcon(highlightedIcon);
      setTimeout(function () {
        self.setAnimation(null);
      }, 1400);
    });

    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  document.getElementById('show-coffee').addEventListener('click', showCoffee);
  document.getElementById('hide-coffee').addEventListener('click', hideCoffee);
  document.getElementById('area-zoom').addEventListener('click', function() {
    areaZoom();
  });

// Model
  var Coffee = function(data) {
    var self = this;
    self.title = ko.observable(data.title);
    self.location = ko.observable(data.location);
    self.marker = ko.observable(marker.position);
  };

// View Model
  var ViewModel = function() {
      var self = this;

      this.coffeeList = ko.observableArray([]);

      locations.forEach(function(coffeeItem) {
        self.coffeeList.push( new Coffee(coffeeItem) );
      });

      this.currentCoffee = ko.observable(this.coffeeList()[0] );

      self.setCoffee = function(clickedCoffee) {
        self.currentCoffee(clickedCoffee);
        var marker = markers.find(function(marker) {
          return marker.title === clickedCoffee.title();
        });
        google.maps.event.trigger(marker, 'mouseover');
        google.maps.event.trigger(marker, 'mouseout');
      };
  };
  ko.applyBindings(new ViewModel());
}

// This function populates the infowindow when the marker is clicked.
function makeInfoWindow(marker, infowindow) {
  // Check that infowindow not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // Determine position of streetview image, calculate the heading, then get a
    // panorama and set the options.
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 0
            }
          };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Coffee Shop Street View Available</div>');
      }
    }
    // Use streetview service to get the closest streetview image.
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

// This function will loop through the coffee markers and display them all.
function showCoffee() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// This function will loop through the coffee markers and hide them all.
function hideCoffee() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

// The marker will be 21 px wide by 34 high with an origin
// of 0,0 and anchored at 10, 34
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// This function zooms to location provided by user.
function areaZoom() {
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('area-zoom-text').value;
  if (address == '') {
    window.alert('Enter location name or address');
  } else {
    geocoder.geocode(
      {address: address,
        componentRestrictions: {locality: 'Washington'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('Location not found. Enter more specific location.');
        }
      });
  }
}

// MODEL: These are the coffee shops that will be displayed
var locations = [
  {title: 'Speed Trap Espresso', location: {lat: 47.8172539, lng: -122.2898432}, id: 'ChIJh4dyUkIFkFQR_AbLRmMZW6M'},
  {title: 'Stopwatch Espresso', location: {lat: 47.8214669, lng: -122.2822018}, id: 'ChIJi3_dUGkFkFQRL6dQqOo3Gwc'},
  {title: 'Pit Stop Espresso', location: {lat: 47.8134796, lng: -122.2859313}, id: 'ChIJr5b_41wFkFQRPLFyGvyNAoo'},
  {title: 'Urban City Coffee', location: {lat: 47.80662230000001, lng: -122.2917646}, id: 'ChIJY2_uYVcFkFQRsUMM3ZpQ8ys'},
  {title: 'Caffe Ladro', location: {lat: 47.8209394, lng: -122.3189275}, id: 'ChIJo-geqzYFkFQR8Gl2SLk4p3c'},
  {title: 'Aloha Cafe', location: {lat: 47.8210596, lng: -122.3255188}, id: 'ChIJUxrJFjMFkFQRpB4AY4YMa_4'},
  {title: 'Gourmet Latte', location: {lat: 47.8174411, lng: -122.3171632}, id: 'ChIJ3SEYlDUFkFQRWo9_mULlcIc'},
  {title: 'Starbucks', location: {lat: 47.8103318, lng: -122.3773061}, id: 'ChIJfXz8WfoakFQRujQfPNsjvw0'},
  {title: 'Rila Bakery & Cafe', location: {lat: 47.8210347, lng: -122.3367312}, id: 'ChIJ2QRn-M0akFQRxu8-1IgGmpk'},
  {title: 'Cafe Aroma', location: {lat: 47.748389, lng: -122.323504}, id: 'ChIJiaQA9v0QkFQRsNH0PgAtIGw'},
  {title: 'Double Cup Coffee', location: {lat: 47.80174239999999, lng: -122.3297188}, id: 'ChIJcaiGNrsakFQRAUVs06Pz2yU'},
  {title: 'Rooster\'s Espresso', location: {lat: 47.798316, lng: -122.328315}, id: 'ChIJS_3Ng6QakFQR_sv92ORPD08'},
  {title: 'Espresso Break', location: {lat: 47.7879252, lng: -122.30878}, id: 'ChIJ8-GdsA8QkFQRBO7vkifpNVk'},
  {title: 'Jason\'s Java', location: {lat: 47.7842249, lng: -122.273969}, id: 'ChIJhzbsbt4PkFQRvERzpebLtVA'},
  {title: 'Perfetto Espresso', location: {lat: 47.777868, lng: -122.3088007}, id: 'ChIJcU6C4RQQkFQRJRRYpE9HBXE'},
  {title: 'Supreme Bean Espresso', location: {lat: 47.7751154, lng: -122.3093113}, id: 'ChIJpT2Lp2oQkFQRR4JM2FyiVV8'},
  {title: 'Richmond Beach Coffee Shop', location: {lat: 47.77016700000001, lng: -122.3765907}, id: 'ChIJtUA5TZ8QkFQRLXdZzWpfSYg'},
  {title: 'Seattle Gourmet Coffee', location: {lat: 47.7573859, lng: -122.314393}, id: 'ChIJJUecslYQkFQRNVSuOJkWbfo'},
  {title: 'Ladybug Bikini Espresso', location: {lat: 47.7465702, lng: -122.3459965}, id: 'ChIJ86loteAQkFQRpOA9hQ8Xlj8'},
  {title: 'Espresso Works', location: {lat: 47.7598364, lng: -122.2499516}, id: 'ChIJTdkEPNgRkFQR6fYJsyX9jYI'},
  {title: 'Coffee Sensations', location: {lat: 47.7689583, lng: -122.2693728}, id: 'ChIJNyenoisQkFQRajXcyq4_hSQ'},
  {title: 'Grounded Espresso', location: {lat: 47.7821982, lng: -122.3669183}, id: 'ChIJ3URRI3kakFQRDz9t0sQAgaM'},
  {title: 'A Brewed Awakening', location: {lat: 47.8065516, lng: -122.3468446}, id: 'ChIJSxOh8L8akFQRMfJFMaCTTMY'},
  {title: 'Waterfront Cafe', location: {lat: 47.8101043, lng: -122.3875991}, id: 'ChIJ53ohzvgakFQR2OlJaA3uLnk'},
  {title: 'Sweet Shots', location: {lat: 47.8047688, lng: -122.3283478}, id: 'ChIJgaLhcLoakFQRZ7irf3iknDg'}
];
