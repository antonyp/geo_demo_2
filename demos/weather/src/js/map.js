var colors = [ 'rgb(211,36,199)', 'rgb(72,30,149)', 'rgb(26,0,12)', 'rgb(80,0,24)', 'rgb(121,0,31)', 'rgb(168,0,39)', 'rgb(199,0,38)', 'rgb(220,0,33)', 'rgb(239,0,30)', 'rgb(255,34,36)', 'rgb(255,69,47)', 'rgb(255,104,58)', 'rgb(255,136,69)', 'rgb(255,155,78)', 'rgb(255,173,86)', 'rgb(255,195,106)', 'rgb(255,213,126)', 'rgb(255,224,146)', 'rgb(255,234,166)', 'rgb(255,246,187)', 'rgb(255,253,207)', 'rgb(246,250,214)', 'rgb(237,247,219)', 'rgb(219,241,201)', 'rgb(197,231,183)', 'rgb(144,219,169)', 'rgb(114,205,188)', 'rgb(71,201,194)', 'rgb(0,183,196)', 'rgb(0,170,195)', 'rgb(0,148,190)', 'rgb(0,122,177)', 'rgb(0,98,164)', 'rgb(0,78,155)', 'rgb(6,64,145)', 'rgb(0,47,117)', 'rgb(0,34,86)', 'rgb(134,25,121)', 'rgb(137,91,164)', 'rgb(135,153,196)', 'rgb(174,206,226)', 'rgb(199,236,254)'];
var temps = [52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, -2, -4, -6, -8, -10, -12, -14, -16, -18, -20, -25, -33, -40, -50, -60];

function tempScale(t) {
    console.log(t);
    var index = 0;
    for (var i = 0; i < temps.length; i++) {
        if (t > temps[i]) {
            index = i;
        }else{
            i = temps.length;
        }
    }
    return colors[index];
}
            

google.maps.event.addDomListener(window, 'load', initMap);

var map;

var areaOfInterest = new google.maps.LatLngBounds(
        new google.maps.LatLng(-54.648412502316674,157.8955078125),
        new google.maps.LatLng(-26.11598592533351,193.53515625)
        );

function initMap() {
    /* Google Map default options */
    var mapOptions = {
        center: new google.maps.LatLng(-41.16, 172.43),
        zoom: 6
    };

    /* compile the Mustache popup template (makes it faster for repeated use as is
     * the case here) */
    //var compiledTemplate= Mustache.compile(templateString['readings']);

    /* keep track of open info windows */
    var openInfoWindows = [];

    /* default style for the claims markers */
    var symbolNormal = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4,
        fillColor: '#1297f1',
        fillOpacity: 1,
        strokeColor: 'black',
        strokeWeight: 1.5
    };

    /* Google Maps map */
    map = new google.maps.Map(document.getElementById("map-canvas"),  mapOptions);

    /* add readings data to map */
    $.getJSON('data/data.json', function (json) {
        /* for each feature in the GeoJSON file  */
        json.r.forEach(function (f) {
            var position = new google.maps.LatLng(
                f.mla,
                f.mlo
                );

            if (areaOfInterest.contains(position)) {
                /* create a marker for this feature */
                if (f.Primary && f.Primary.dt) {
                    var marker = new MarkerWithLabel({
                        position: position,
                        icon: symbolNormal,
                        map: map,
                        labelContent: f.Primary.dt + '&deg;C | ' + f.Primary.dws + 'km/h',
                        labelAnchor: new google.maps.Point(22,0),
                        labelClass: 'labels',
                        labelStyle: {
                            backgroundColor: 'lightgreen'//tempScale(f.Primary.dt)
                        }
                    });
                }

                /* generate the popup HTML from the template and template data */
                /*
                   var popuphtml = compiledTemplate(f.properties);

                   google.maps.event.addListener(marker, 'click', function () {
                   var infowindow = new google.maps.InfoWindow({
                   content: popuphtml,
                   maxWidth: 800
                   });
                   marker.openWindow = true;

                // close any open info windows before opening a new one
                openInfoWindows.forEach(function (currentwindow) {
                currentwindow.close();
                });

                // clear list of open windows now that we just closed them all
                openInfoWindows = [];

                // now open the next one
                infowindow.open(map, marker);

                // add the window we just opened to the list of open windows
                openInfoWindows.push(infowindow);
                });
                */
            }
        });

    });
    createSearchBox();
}

function createSearchBox() {
    var markers = [];

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */ (
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */
        (input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            /*
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
      */

            //markers.push(marker);

            bounds.extend(place.geometry.location);
            //bounds.union(place.geometry.viewport);
        }

        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
}
