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
        google.maps.event.trigger(location.marker, 'click')
        google.maps.event.trigger(location.marker, 'mouseover');
        google.maps.event.trigger(location.marker, 'mouseout');
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
            var searchValue = location.name.toLowerCase().indexOf(filter) !== -1;
            location.marker.setVisible(searchValue);
            return searchValue
        });
    }
    });
};
