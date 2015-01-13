/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-36.84116, 174.79317),
    zoom: 12,
    styles: snazzy['subtlegrayscale']
};

var map;

var placesService;

var layers = {};

var openInfoWindows = [];

var marketPenetrationLayerId = '14243126420781440025-14681502266025613017';
var salesTerritoriesLayerId = '14243126420781440025-03447452725579868080';
var salesTerritoriesTableId = '14243126420781440025-06852393645150519151';

var compiledTemplateTerritory = Mustache.compile(templateString['territory']);
var compiledTemplateStore = Mustache.compile(templateString['store']);

var chartCounter = 0;

var directionsService = new google.maps.DirectionsService();
var directionsDisplay;

var directionsInfoWindow = new google.maps.InfoWindow();

function initialise() {
    $('#legend').hide();

    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    placesService = new google.maps.places.PlacesService(map);

    google.maps.event.addListener(map, 'bounds_changed', function(e) {
        addPrimaryStores();
        addSecondaryStores();
    });

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

    // Population Range
    var populationRangeId = {
        '0': '14243126420781440025-16891797349373911882',//
        '5': '14243126420781440025-16891797349373911882',//
        '10': '14243126420781440025-16891797349373911882',//
        '15': '14243126420781440025-16891797349373911882',
        '20': '14243126420781440025-14358731186252824513',
        '25': '14243126420781440025-05366050553739564514',
        '30': '14243126420781440025-01976180145767454159',
        '35': '14243126420781440025-01976180145767454159',//fix
        '40': '14243126420781440025-01976180145767454159',//
        '45': '14243126420781440025-01976180145767454159',//
        '50': '14243126420781440025-17782785704422799832',//
        '55': '14243126420781440025-17782785704422799832',//
        '60': '14243126420781440025-17782785704422799832',//fix
        '65': '14243126420781440025-17782785704422799832'
    };
    for (var start = 0; start < 70; start += 5) {
        layers['layer-population-range-' + start] = new google.maps.visualization.MapsEngineLayer({
            layerId: populationRangeId[start],
            map: null,
            suppressInfoWindows: true,
            clickable: false
        });
    }

    $('#layer-population-by-age').change(function() {
        if($('#layer-population-by-age').prop('checked')) {
            layerTogglePopulationRange($( "#population-range-slider" ).slider("value"));
        }else{
            layerTogglePopulationRange(undefined);
        }
    });

    // Market Penetration
    layers['layer-market-penetration'] = new google.maps.visualization.DynamicMapsEngineLayer({
                layerId: marketPenetrationLayerId,
                map: null,
                suppressInfoWindows: true, /* we create our own, rather than using those from Maps Engine */
                clickable: true
            });
    $('#layer-market-penetration').change(layerToggle);

    // Sales Regions
    layers['layer-sales-territories'] = new google.maps.visualization.DynamicMapsEngineLayer({
                layerId: salesTerritoriesLayerId,
                map: null,
                suppressInfoWindows: true, /* we create our own, rather than using those from Maps Engine */
                clickable: true
            });
    $('#layer-sales-territories').change(layerToggle);

    google.maps.event.addListener(layers['layer-sales-territories'], 'mouseover', function(e) {
          var style = layers['layer-sales-territories'].getFeatureStyle(e.featureId);
          style.strokeColor = 'red';
          style.strokeWidth = 3;
          style.fillColor = 'red';
          style.fillOpacity = 0.3;
    });

    google.maps.event.addListener(layers['layer-sales-territories'], 'mouseout', function(e) {
          layers['layer-sales-territories'].getFeatureStyle(e.featureId).resetAll();
    });

    google.maps.event.addListener(layers['layer-sales-territories'], 'click', function(e) {
        chartCounter = chartCounter + 1;
        var contentString = compiledTemplateTerritory({
            "territory": chance.city(),
            "chartCounter": chartCounter,
            "region-owner": chance.name(),
            "ytd-gross": chance.dollar({max: 1000000})
        });

    /*
        var getFeatureURL = 'https://www.googleapis.com/mapsengine/v1/tables/' + salesTerritoriesTableId + '/features/' + e.featureId + '?version=published&key=AIzaSyDOtG9lOtO2P1iS4E41eYOz1kb4cGVRJgc&select=AU2013_NAM';

        $.ajax({
            url: getFeatureURL,
            dataType: 'json',
            success: function (response) {
                if (response.properties.hasOwnProperty("floors")) {

                }
                // update feature info window using the poperties of the selected feature
                //$("#feature-info").innerHTML = compiledTemplateInfo(feature.properties);
            },
            error: function (response) {
                response = JSON.parse(response.responseText);
                console.log("Error: ", response);
            }
        });
        */

        var infowindow = new google.maps.InfoWindow({
            position: e.latLng,
            content: contentString
        });

        openInfoWindows.forEach(function (i) {
            i.close();
        });

        google.maps.event.addListener(infowindow, 'domready', function () {
                    $('#clients a').click(function (e) {
                        e.preventDefault()
                        $(this).tab('show')
                    });
                    $('#nonclients a').click(function (e) {
                        e.preventDefault()
                        $(this).tab('show')
                    })
                    $('#claims a').click(function (e) {
                        e.preventDefault()
                        $(this).tab('show')
                    });

                    //$('.input-daterange').datepicker({});

                    // make the charts in the info window
                    var ctx = $("#popupChart" + chartCounter).get(0).getContext("2d");

                    var linedata = {
                            labels : ["January","February","March","April","May","June","July"],
                            datasets : [
                                    {
                                            fillColor : "rgba(220,220,220,0.5)",
                                            strokeColor : "rgba(220,220,220,1)",
                                            pointColor : "rgba(220,220,220,1)",
                                            pointStrokeColor : "#fff",
                                            data : [65,59,90,81,56,55,40]
                                    },
                                    {
                                            fillColor : "rgba(151,187,205,0.5)",
                                            strokeColor : "rgba(151,187,205,1)",
                                            pointColor : "rgba(151,187,205,1)",
                                            pointStrokeColor : "#fff",
                                            data : [28,48,40,19,96,27,100]
                                    }
                            ]
                    }

                    //This will get the first returned node in the jQuery collection.
                    var brand1 = Math.round(Math.random() * 100);
                    var brand2 = Math.round((100 - brand1) * Math.random()) + brand1;
                    var piedata = [
                        {
                            value: brand1,
                            color: "#F38630"
                        },
                        {
                            value: brand2,
                            color: "#E0E4CC"
                        },
                        {
                            value: 100,
                            color: "#69D2E7"
                        }
                        ];

                    var myNewChart = new Chart(ctx).Line(linedata, {
                        animationEasing: "easeOutExpo",
                        animationSteps: 50
                    });

                });

        infowindow.open(map);

        openInfoWindows.push(infowindow);
    });

    layers['layer-median-population'] = new google.maps.visualization.MapsEngineLayer({
                layerId: '14243126420781440025-17474331814929300847',
                map: null,
                suppressInfoWindows: false,
                clickable: true
            });

    $('#layer-median-population').change(layerToggle);

    /* directions */
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        hideRouteList: true,
        suppressMarkers: true,
        map: map,
        infoWindow: directionsInfoWindow
    });
    /*google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        updateTripStats(directionsDisplay.getDirections());
    });*/

    $('#distance-control').on('click', distanceControl);

}

var storeSelected;
var locationSelected;
var originMarker;

function distanceControl() {
    google.maps.event.addListener(map, 'click', function(e) {
        locationSelected = e.latLng;
        tryToCalculateDistance();
    });
    google.maps.event.addListener(layers['layer-market-penetration'], 'click', function(e) {
        locationSelected = e.latLng;
        tryToCalculateDistance();
    });
}

function tryToCalculateDistance() {
    if (storeSelected && locationSelected) {
        var request = {
            origin: locationSelected,
            destination: storeSelected,
            travelMode: google.maps.TravelMode.DRIVING
        };
        if (originMarker) {
            originMarker.setMap(null);
        }
        originMarker = new google.maps.Marker({
            position: locationSelected,
            draggable: true,
            clickable: false,
            map: map
        });
        google.maps.event.addListener(originMarker, 'dragend', function() {
            locationSelected = originMarker.getPosition();
            tryToCalculateDistance();
        });
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(map);
                directionsDisplay.setDirections(response);
                var totalDist = 0;
                var totalTime = 0;
                var myroute = response.routes[0];
                for (var i = 0; i < myroute.legs.length; i++) {
                    totalDist += myroute.legs[i].distance.value;
                    totalTime += myroute.legs[i].duration.value;
                }
                var totalDistInKm = totalDist / 1000.0;
                var totalTimeInMin = totalTime = 60.0;
                directionsInfoWindow.setContent('<b>' + totalDistInKm + 'km</b> in <b>' + totalTimeInMin + 'min</b> of driving time');
                directionsInfoWindow.open(map, originMarker);
                directionsInfoWindow.setMap(map);
                google.maps.event.addListener(directionsInfoWindow, 'closeclick', function () {
                    originMarker.setMap(null);
                    locationSelected = undefined;
                    directionsDisplay.setMap(null);
                });
            }
        });
    }
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
    if (this.checked) {
        layers[this.id].setMap(map);
    }else{
        layers[this.id].setMap(null);
    }

    if (/-signal-strength$/.test(this.id)) {
        /*if (
                $('#layer-2g-signal-strength').checked ||
                $('#layer-3g-signal-strength').checked ||
                $('#layer-4g-signal-strength').checked
           ) {*/
        if ($('#signalStrengths :checkbox:checked').length > 0) {
            $('#legend').fadeIn();
        }else{
            $('#legend').fadeOut();
        }
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
        // place already stored in set of markers
        return null;
    }else{
        var marker = new google.maps.Marker({
            position: place.geometry.location,
            map: null,
            title: place.name,
            icon: iconImage
        });

        google.maps.event.addListener(marker, 'click', function() {
            storeSelected = marker.getPosition();
            tryToCalculateDistance();
        });

        if (!(layer in placesOnMap)) {
            placesOnMap[layer] = {};
        }
        placesOnMap[layer][place.id] = marker;
        return marker;
    }
}

function primaryStoresCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            var marker = addPlace('layer-primary-stores', place);

            if (marker != null) {
                google.maps.event.addListener(marker, 'click', function() {
                    var primaryStoreInfoWindow = new google.maps.InfoWindow({
                        content: compiledTemplateStore({
                            "store": chance.city(),
                            "store-manager": chance.name(),
                            "phone": "+64 " + chance.phone()
                                 }),
                    });
                
                    primaryStoreInfoWindow.open(map, this);
                });
            }
        }
    }
}

function addPrimaryStores() {
    var request = {
        bounds: map.getBounds(),
        name: "2degrees"
    };

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


function layerTogglePopulationRange(start) {
    // remove any existing layers
    for (var i = 0; i < 70; i += 5) {
        layers['layer-population-range-' + i].setMap(null);
    }
    // and add the selected one
    if (start != undefined) {
        layers['layer-population-range-' + start].setMap(map);
    }
};

/* population age ranges */
$(function() {
    $( "#population-range-slider" ).slider({
        value:100,
        min: 0,
        max: 65,
        step: 5,
        slide: function( event, ui ) {
            if (ui.value == 65) {
                $( "#population-range" ).text( ui.value + '+' );
            }else{
                $( "#population-range" ).text( ui.value + ' - ' + (ui.value + 4) );
            }
        },
        change: function (event, ui ) {
            $('#layer-population-by-age').prop('checked', true);
            layerTogglePopulationRange(ui.value);
        }
    });
});
