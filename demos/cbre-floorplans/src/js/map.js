/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-33.86591, 151.20981),
    zoom: 15
};

var compiledTemplateInfo = Mustache.compile(templateString['info']);

var buildingOutlinesLayerId = '14243126420781440025-11904137830584140679';
var buildingOutlinesDataSourceId = '14243126420781440025-07292222469554273802';

/* Google Maps map */
var map;

var selectedFeature = null;
var selectedStrokeColor = "red";

var currentFloorLayer;

function clearFloorSelections() {
    $("#floor-control .btn.active").removeClass("active");
    
    // remove any existing Maps Engine Floor Plan Layer
    if (currentFloorLayer) {
        currentFloorLayer.setMap(null);
    }
}

var globalAuthResult;
var buildingOutlines;

var searchMarkers = [];

function floorId(buildingId, floor) {
    switch (buildingId) {
            case "1":
            	if (floor == "G") {
                    return "14243126420781440025-03905909624632846619";
                }
            break;
            case "2":
            	if ((floor == "LG") || (floor == "G")) {
                    return "14243126420781440025-16932951632409324660";
                }else{
                    return "14243126420781440025-13869695321477240807";
                }
            break;
            default:
            console.log("Unknown building id: " + buildingId);
    }
    return null;
}

function loadFloor(buildingId, floor) {
    clearFloorSelections();
    
    var outlineStyle = buildingOutlines.getFeatureStyle(buildingId);
    outlineStyle.fillOpacity = '0';
    
    var buttonId = "floorButton_" + buildingId + "_" + floor;
    $("#" + buttonId).addClass("active");
    
    // load the GME layer
    currentFloorLayer = new google.maps.visualization.MapsEngineLayer({
        layerId: floorId(buildingId, floor),
        accessToken: globalAuthResult.access_token,
        map: map,
        suppressInfoWindows: true,
        clickable: false
    });
}

function authorizationComplete(authResult) {
    // hacky, but all things which use it are only called after we've set it here
    globalAuthResult = authResult;
    
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

    createSearchBox();

    buildingOutlines = new google.maps.visualization.DynamicMapsEngineLayer({
        layerId: buildingOutlinesLayerId,
        accessToken: authResult.access_token,
        map: map,
        suppressInfoWindows: true,
        clickable: true
    });

    google.maps.event.addListener(buildingOutlines, 'mouseover', function (event) {
        if (selectedFeature != event.featureId) {
            // only set the hover style if this is not the currently selected building
            var style = buildingOutlines.getFeatureStyle(event.featureId);
            style.fillOpacity = '0.5';
            if (event.featureId == selectedFeature) {
                style.strokeColor = selectedStrokeColor;
            }
        }
    });

    google.maps.event.addListener(buildingOutlines, 'mouseout', function (event) {
        if (selectedFeature != event.featureId) {
            var style = buildingOutlines.getFeatureStyle(event.featureId);
            style.resetAll();
            //if (event.featureId == selectedFeature) {
            //    style.strokeColor = selectedStrokeColor;
            //}
        }
    });

    google.maps.event.addListener(buildingOutlines, 'click', function (event) {
        selectedBuilding = event.featureId;
        
        searchMarkers.forEach(function(marker) {
            marker.setMap(null);
        });
        
        /* remove selection style from previous feature */
        if (selectedFeature) {
            var style = buildingOutlines.getFeatureStyle(selectedFeature);
            style.resetAll();
        }
        
        // remove any previous building level control
        var floorControlNode = $("#floor-control")[0];
        while (floorControlNode.firstChild) {
            floorControlNode.removeChild(floorControlNode.firstChild);
        }
        
        clearFloorSelections();
        
        // add the loading spinner
        var loadSpinner = new Spinner({left: 0}).spin();
        floorControlNode.appendChild(loadSpinner.el);

        // and update our selected feature to the current one
        selectedFeature = event.featureId;

        // set selection style
        var style = buildingOutlines.getFeatureStyle(event.featureId);
        style.strokeColor = selectedStrokeColor;
        style.fillOpacity = "0";

        // zoom to click
        //map.panTo(event.latLng);
        //map.setZoom(17);
        
        // make a call to the Google Maps Engine API to get the properties for this selected feature
        var getFeatureURL = 'https://www.googleapis.com/mapsengine/v1/tables/' + buildingOutlinesDataSourceId + '/features/' + event.featureId
        
        $.ajax({
            url: getFeatureURL,
            dataType: 'json',
            headers: {
              'Authorization': 'Bearer ' + authResult.access_token
            },
            success: function(response) {
                // remove loading spinner
                var floorControlNode = $("#floor-control")[0];
                while (floorControlNode.firstChild) {
                    floorControlNode.removeChild(floorControlNode.firstChild);
                }
                
                if (response.properties.hasOwnProperty("floors")) {
                    var buttonGroup = $('<div class="btn-group-vertical btn-group-sm"></div>')[0];
                    
                    var header = $('<h4>Floors</h4>')[0];
                    buttonGroup.appendChild(header);
                    
                    response.properties.floors.split(",").reverse().forEach(function(i) {
                        var buttonId = "floorButton_" + event.featureId + "_" + i;
                        var button = $('<button id="' + buttonId + '" type="button" class="btn btn-default" onclick="loadFloor(' + "'" + event.featureId + "'" + ',' + "'" + i + "'" + ')">' + i + '</button>')[0];
                        buttonGroup.appendChild(button);
                    });
                    $("#floor-control")[0].appendChild(buttonGroup);
                }
                // update feature info window using the poperties of the selected feature
                //$("#feature-info").innerHTML = compiledTemplateInfo(feature.properties);
            },
            error: function(response) {
              response = JSON.parse(response.responseText);
              console.log("Error: ", response);
            }
          });
        

    });

    //var oms = new OverlappingMarkerSpiderfier(map);

}


function createSearchBox() {

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

        for (var i = 0, marker; marker = searchMarkers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        searchMarkers = [];
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
              var marker = new google.maps.Marker({
                map: map,
                //icon: image,
                title: place.name,
                position: place.geometry.location
              });

            searchMarkers.push(marker);

            if (i == 0) { // but only zoom to first result. e.g. 570 George Street
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                }else if (place.geometry.location) {
                    bounds.extend(place.geometry.location);
                }
            }
        }

        if (bounds) {
            map.fitBounds(bounds);
            if (map.getZoom() > 18) {
                map.setZoom(18);
            }
        }
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'bounds_changed', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);
    });
}