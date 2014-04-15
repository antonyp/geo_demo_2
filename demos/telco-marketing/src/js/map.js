/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-36.84116, 174.79317),
    zoom: 10,
    styles: snazzy['subtlegrayscale']
    //styles: snazzy['subtlegrayscale']
};

var map;

var placesService;

function initialise() {
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    placesService = new google.maps.places.PlacesService(map);

    addPrimaryStores();
    addSecondaryStores();

    $('#layer-primary-stores').change(markersToggle);
    $('#layer-secondary-stores').change(markersToggle);

    /* create xg-signal-strength but don't add to map initially */
    layers['layer-2g-signal-strength'] = new google.maps.visualization.MapsEngineLayer({
                layerId: '14243126420781440025-06423057872183631348',
                map: null,
                suppressInfoWindows: true,
                clickable: false
            });
    
    layers['layer-3g-signal-strength'] = new google.maps.visualization.MapsEngineLayer({
                layerId: '14243126420781440025-16617043393034901554',
                map: null,
                suppressInfoWindows: true,
                clickable: false
            });

    layers['layer-4g-signal-strength'] = new google.maps.visualization.MapsEngineLayer({
                layerId: '14243126420781440025-13196914896823253024',
                map: null,
                suppressInfoWindows: true,
                clickable: false
            });

    layers['layer-2g-signal-strength'].setOpacity(0.7);
    layers['layer-3g-signal-strength'].setOpacity(0.7);
    layers['layer-4g-signal-strength'].setOpacity(0.7);

    $('#layer-2g-signal-strength').change(layerToggle);
    $('#layer-3g-signal-strength').change(layerToggle);
    $('#layer-4g-signal-strength').change(layerToggle);

}

function markersToggle() {
    if (this.id in placesOnMap) {
        for (var id in placesOnMap[this.id]) {
            if (this.checked) {
                placesOnMap[this.id][id].setMap(map);
            }else{
                placesOnMap[this.id][id].setMap(null);
            }
        }
    }
}

function layerToggle() {
    var layermap = layers[this.id].getMap();
    var setmap = map;
    if (layermap) {
        map = null;
    }

    if (this.checked) {
        layers[this.id].setMap(setmap);
    }else{
        layers[this.id].setMap(null);
    }
}

var placesOnMap = {};

// add a place to a map
function addPlace(layer, place) {
    var iconImage = null;
    switch (layer) {
        case 'layer-primary-stores':
            iconImage = 'img/mapicons-phones.png';
            break;
        case 'layer-secondary-stores':
            iconImage = 'img/mapicons-supermarket.png';
            break;
    }
    if ((layer in placesOnMap) && (place.id in placesOnMap[layer])) {
        //object already on map
    }else{
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: null,
            title: place.name,
            icon: iconImage
        });
        if (!(layer in placesOnMap)) {
            placesOnMap[layer] = {};
        }
        placesOnMap[layer][place.id] = marker;
    }
}

function addPrimaryStores() {
    var request = {
        bounds: map.getBounds(),
        name: "2degrees"
    };

    function primaryStoresCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                addPlace('layer-primary-stores', place);
            }
        }
    }

    placesService.nearbySearch(request, primaryStoresCallback);
}

function addSecondaryStores() {
    var request = {
        bounds: map.getBounds(),
        type: "electronics_store"
    };

    function secondaryStoresCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                addPlace('layer-secondary-stores', place);
            }
        }
    }

    placesService.nearbySearch(request, secondaryStoresCallback);
}

google.maps.event.addDomListener(window, 'load', initialise);
