/* Google Map default options */
var mapOptions = {
  center: new google.maps.LatLng(-41.16, 172.43),
  zoom: 6
};

/* compile the Mustache popup template (makes it faster for repeated use as is
 * the case here) */
var compiledPopupTemplate = Mustache.compile(popupTemplateString);

/* keep track of open info windows */
var openInfoWindows = [];

/* keep track of the currently selected marker (the one with the popup window active) */
var selectedMarker;

/* default style for the claims markers */
var symbolNormal = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 4,
    fillColor: '#1297f1',
    fillOpacity: 1,
    strokeColor: 'black',
    strokeWeight: 1.5
};

/* extend the default style with some changes for selected/highlighted markers */
var symbolHighlighted = $.extend({}, symbolNormal);
symbolHighlighted.fillColor = '#5ab7f5';
symbolHighlighted.scale = 8;

/* keep track of claims markers for client side logic (not yet used) */
var dataPoints = [];

/* Google Maps map */
var map;

/* claim density heatmap */
var claimArray, heatmap;
var claimLocations = [];

function authorizationComplete(authResult) {
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
    createSearchBox();
    
    /*var mapsEnginePolicyHolders = new google.maps.visualization.MapsEngineLayer({
        layerId: '14243126420781440025-08195544792767081935',
        accessToken: authResult.access_token,
        map: map
    });*/
    
    //var oms = new OverlappingMarkerSpiderfier(map);
    
    /* add claims data to map */
    $.getJSON('data/sample.json', function (geojson) {
        /* for each feature in the GeoJSON file  */
        geojson.features.forEach(function(feature) {
            /* if the feature is a Point */
            if (feature.geometry.type === "Point") {
                var position = new google.maps.LatLng(
                        feature.geometry.coordinates[1],
                        feature.geometry.coordinates[0]
                    );
                
                /* create a marker for this feature */
                var marker = new google.maps.Marker({
                    position: position,
                    icon: symbolNormal,
                    map: map
                });
                
                dataPoints.push({marker: marker, properties: feature.properties});
                
                /* add this location for use in the claim density heatmap */
                claimLocations.push(position);
                
                // defaults
                feature.properties["building-color"] = "text-muted";
                feature.properties["contents-color"] = "text-muted";
                switch (feature.properties.CDTYPRDH) {
                        case "BLDG":
                        	feature.properties["type-class"] = "bldg";
                        	feature.properties["fa-type"] = "home";
                        	feature.properties["type"] = "Building";
                        	feature.properties["building-color"] = "text-success";
                        break;
                        case "CONT":
                        	feature.properties["type-class"] = "cont";
                        	feature.properties["fa-type"] = "suitcase";
                        	feature.properties["type"] = "Contents";
                        	feature.properties["contents-color"] = "text-success";
                        break;
                        case "HPAC":
                        	feature.properties["type-class"] = "hpac";
                        	feature.properties["fa-type"] = "users";
                        	feature.properties["type"] = "Building & Contents";
                        	feature.properties["building-color"] = "text-success";
                        	feature.properties["contents-color"] = "text-success";
                        break;
                        case "LAND":
                        	feature.properties["type-class"] = "land";
                        	feature.properties["fa-type"] = "legal";
                        	feature.properties["type"] = "Landlord";
                        	feature.properties["building-color"] = "text-success";
                        	feature.properties["contents-color"] = "text-success";
                        break;
                }

                if (feature.properties.AgeOfOldestPolicyHolder == "C") {
                    feature.properties.AgeOfOldestPolicyHolder = "n/a";
                }else{
                    feature.properties.AgeOfOldestPolicyHolder = numeral(feature.properties.AgeOfOldestPolicyHolder).format('0,0');
                }
                        
                 /* add extra data to the feature properties before we compile it into HTML using mustache */
                feature.properties["BuildingSumInsured"] = numeral(feature.properties.BuildingSumInsured).format('$0,0.00');
                feature.properties["ContentsSumInsured"] = numeral(feature.properties.ContentsSumInsured).format('$0,0.00');
                
                feature.properties["ThisYearBldgPremium"] = numeral(feature.properties.ThisYearBldgPremium).format('$0,0.00');
                feature.properties["ThisYearContPremium"] = numeral(feature.properties.ThisYearContPremium).format('$0,0.00');
                
                feature.properties["RecentBuildingClaimCost"] = numeral(feature.properties.RecentBuildingClaimCost).format('$0,0.00');
                feature.properties["RecentContentsClaimCost"] = numeral(feature.properties.RecentContentsClaimCost).format('$0,0.00');
                
                feature.properties["Last5YearsBldgPremium"] = numeral(feature.properties.Last5YearsBldgPremium).format('$0,0.00');
                feature.properties["Last5YearsContPremium"] = numeral(feature.properties.Last5YearsContPremium).format('$0,0.00');
                
                feature.properties["lat"] = feature.geometry.coordinates[1];
                feature.properties["lng"] = feature.geometry.coordinates[0];
                feature.properties["zoom"] = 16;

                /* generate the popup HTML from the template and template data */
                var popuphtml = compiledPopupTemplate(feature.properties);
                
                /* set mouseover/mouseout/click event listeners */
                google.maps.event.addListener(marker, 'mouseover', function() {
                    marker.setIcon(symbolHighlighted);
                });
                
                google.maps.event.addListener(marker, 'mouseout', function () {
                    if (!marker.openWindow) {
                        marker.setIcon(symbolNormal);
                    }
                });
                
                google.maps.event.addListener(marker, 'click', function() {
                    var infowindow = new google.maps.InfoWindow({
                        content: popuphtml,
                        maxWidth: 800
                    });
                    marker.openWindow = true;
                    
                    /* register an event to unhighlight the marker when the popup is closed */
                    google.maps.event.addListener(infowindow, 'closeclick', function () {
                        /* if a previous marker is selected then unhighlight it... */
                        if (selectedMarker) {
                            selectedMarker.setIcon(symbolNormal);
                        }
                        marker.openWindow = false;
                    });

                    // close any open info windows before opening a new one
                    openInfoWindows.forEach(function(currentwindow) {
                        currentwindow.close();
                    });
                    
                    /* if a previous marker is selected then unhighlight it... */
                    if (selectedMarker) {
                        selectedMarker.setIcon(symbolNormal);
                    }
                    
                    /* ...because we have a new selected marker... */
                    selectedMarker = marker;
                    
                    /* ...which we need to highlight */
                    selectedMarker.setIcon(symbolHighlighted);

                    // clear list of open windows now that we just closed them all
                    openInfoWindows = [];

                    // now open the next one
                    infowindow.open(map, marker);
                    
                    // add the window we just opened to the list of open windows
                    openInfoWindows.push(infowindow);
                });
            }
        });
        
        /* create the claim density heatmap */
        claimArray = new google.maps.MVCArray(claimLocations);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: claimArray,
            radius: 30
          });
    });
    
  // List the details of a specific Google Maps Engine Map.
  var url = "https://www.googleapis.com/mapsengine/v1/tables/14243126420781440025-08551925598041685897/features?intersects=CIRCLE(174.86994%20-36.86524%2C%201000)&maxResults=10";
/*
  jQuery.ajax({
    url: url,
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + authResult.access_token
    },
    success: function(response) {
      // Log the details of the Map.
      console.log(response);
    },
    error: function(response) {
      response = JSON.parse(response.responseText);
      console.log("Error: ", response);
    }
  });
*/
}

function toggleHeatmap() {
    $('#toggleHeatmap').toggleClass('active');
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function createSearchBox() {
  var markers = [];

    // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
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
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
  });
}