// Map
var map;
var markers = [];
var infoWindow;

var mapError = function() {
    alert("Google Maps unable to load at this time.");
};

function initMap(data) {

    var Place = function(data) {
        var self = this;
        self.title = data.title;
        self.lat = data.lat;
        self.lng = data.lng;
        self.foursquareID = data.foursquareID;
    };

    var styles = [{
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#746855'
            }]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#c61609'
            }]
        },
        {
            featureType: 'water',
            stylers: [{
                color: '#226ebf'
            }]
        }
    ];

    infoWindow = new google.maps.InfoWindow();

    // Creating new map of coffee shops in north Seattle suburbs
    var LatLng = {
        lat: 47.7861000,
        lng: -122.3282000
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: LatLng,
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    var defaultIcon = 'img/cup_small.png';
    //var defaultIcon = makeMarkerIcon('1B965E');
    //var highlightedIcon = makeMarkerIcon('F71313');

    locations.forEach(function(location) {
        var position = {
            lat: location.lat,
            lng: location.lng
        };
        var title = location.title;
        var foursquareID = location.foursquareID;
        location.marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: defaultIcon,
            id: foursquareID,
            animation: google.maps.Animation.DROP
        });
        // Push the marker to our array of markers.
        markers.push(location.marker);

        location.marker.addListener('click', markerInfoWindow);
        location.marker.addListener('mouseover', markerBounce);
        location.marker.addListener('mouseout', defaultMarker);

        function markerBounce() {
            location.marker.setAnimation(google.maps.Animation.BOUNCE);
            location.marker.setIcon(defaultIcon);
            setTimeout(function() {
                location.marker.setAnimation(null);
            }, 1400);
        }

        function defaultMarker() {
            location.marker.setIcon(defaultIcon);
        };

    });

    document.getElementById('show-coffee').addEventListener('click', showCoffee);

    function markerInfoWindow() {
        makeInfoWindow(this, infoWindow);
        map.setZoom(15);
        map.setCenter(this.position);
    }

    function makeInfoWindow(marker, infoWindow) {
      var url = 'https://api.foursquare.com/v2/venues/' + marker.id + '?client_id=Z52MDI2AQMQ41PZA43IJVWCUK3M33JHEKGCSBGUYYI5DUIKZ&client_secret=5E5ROB5B3PPW4MRPCQDQ4TWML20RND4IETUOFIYZOSCW3CL4&v=20170801'
      $.ajax({
          url: url,
          dataType: 'json',
          data: {
              async: true
          },
          success: function(data) {

              if (infoWindow.marker != marker) {
                  infoWindow.marker = marker;
                  infoWindow.setContent('<div>' + '<b>' + marker.title + '</b>' + '</div>' + '<br>' + data.response.venue.location.formattedAddress + '<br>' + data.response.venue.contact.formattedPhone);
                  infoWindow.addListener('closeclick', function() {
                      infoWindow.marker = null;
                  });
                  infoWindow.open(map, marker);
              }
          }
      }).fail(function(e) {
          alert("There was an error with the Foursquare API. Please refresh.");
      });
    }

    function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
      return markerImage;
    }

    // This function will loop through the coffee markers and display them all.
    function showCoffee() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    }

    ko.applyBindings(new ViewModel());
}
