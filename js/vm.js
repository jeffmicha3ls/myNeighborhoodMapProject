var Coffee = function(data) {
    this.name = data.title;
    this.marker = data.marker;
};

var ViewModel = function() {
    var self = this;
    this.title = ko.observableArray([]);
    this.coffeeList = ko.observableArray([]);
    this.filter = ko.observable('');

    locations.forEach(function(coffeeItem) {
        self.coffeeList.push(new Coffee(coffeeItem));
    });

    this.markerInfoWindow = function(location) {
        console.log(location);
        google.maps.event.trigger(location.marker, 'click');
        google.maps.event.trigger(location.marker, 'mouseover');
        google.maps.event.trigger(location.marker, 'mouseout');
    };

    this.currentCoffee = ko.observable(this.coffeeList()[0]);

    self.setCoffee = function(clickedCoffee) {
        self.currentCoffee(clickedCoffee);
        var marker = markers.find(function(marker) {
            return marker.title === clickedCoffee.title();
        });
        google.maps.event.trigger(location.marker, 'mouseover');
    };

    this.coffeePlaces = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
        self.coffeeList().forEach(function(location) {
            if (location.marker) {
                location.marker.setVisible(true);
            }
        });
        return self.coffeeList()
    } else {
        return ko.utils.arrayFilter(self.coffeeList(), function(location) {
            console.log(location);
            var searchValue = location.name.toLowerCase().indexOf(filter) !== -1;
            location.marker.setVisible(searchValue);
            return searchValue
        });
    }
    });
};
