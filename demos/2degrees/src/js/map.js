/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-36.84116, 174.79317),
    zoom: 10,
    styles: snazzy['subtlegrayscale']
};

var clicks = [];
var heatmapData = [];

var heatmap;

var layers = {
    'layer-traffic': new google.maps.TrafficLayer(),
    'layer-transit': new google.maps.TransitLayer()
};

/* array of all data samples from CSV file*/
var allSamples;

/* object of all samples as google.maps objects */
var samples = {};

/* object of all heatmaps for each hourly set of samples */
var heatmap = {};

/* to use the color ramp as a heatmap gradient the first color needs to be
 * transparent */
var colourRamp = 'YlOrRd';
colorbrewer[colourRamp]["9"].unshift(chroma(colorbrewer[colourRamp]["9"][0]).alpha(0).css());

/* current start hour being displayed */
var currentHour = defaultStartHour;

var map;

//var gradient = colorbrewer[colourRamp]["9"];
/*var gradient = [
'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
    ];*/
var gradient = null;

$.ajax({
    url: "data/networkIssuesAkl.txt",
    success: function (csv) {
       allSamples = $.csv.toArrays(csv);
       allSamples.forEach(function(i) {
           var loc = new google.maps.LatLng(i[0], i[1]);
           var startHour = i[2].split('-')[0].split(':')[0];
           var startMinute = i[2].split('-')[0].split(':')[1];
           if (samples[startHour] === undefined) {
               samples[startHour] = [];
           }
           samples[startHour].push(loc);
       });

        Object.keys(samples).forEach(function(i) {
           var pointArray = new google.maps.MVCArray(samples[i]);
           heatmap[i] = new google.maps.visualization.HeatmapLayer({
               data: pointArray,
               gradient: gradient,
               radius: 15
           });
           if (i == currentHour) {
               heatmap[i].setMap(map);
           }
       });

    }
});

function initialise() {
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    $('#layer-traffic').change(layerToggle);
    $('#layer-transit').change(layerToggle);

    $('#layer-dropped-calls-heatmap').attr('checked', 'checked');
    if (heatmap[defaultStartHour] != undefined) {
        heatmap[defaultStartHour].setMap(map);
    }
    $('#layer-dropped-calls-heatmap').change(function() {
        if (heatmap[currentHour] != undefined) {
            if (this.checked) {
                heatmap[currentHour].setMap(map);
            }else{
                heatmap[currentHour].setMap(null);
            }
        }
    });

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

    $("#slider").bind("valuesChanging", function(e, data){
        if (currentHour != data.values.min.getHours()) {
            if (heatmap[currentHour] != undefined) {
                heatmap[currentHour].setMap(null);
            }
            currentHour = data.values.min.getHours();
            if (heatmap[currentHour] != undefined) {
                if ($('#layer-dropped-calls-heatmap').is(':checked')) {
                    heatmap[currentHour].setMap(map);
                }
            }
        }
    });

    addTowersHidden();
    $('#layer-cell-towers').change(layerToggle);

    drawRecordTrail();
    $('#layer-call-routes').change(toggleTrails);

    $('#animate-route-button').on('click', function() {
        var pos = trailCoordinates[0];
        var m = new google.maps.Marker({
            position: pos,
            map: map
        });
        //for (var i = 0; i < trailCoordinates.length - 1; i++) {
        //    var legDist = google.maps.geometry.spherical.computeDistanceBetween(trailCoordinates[i], trailCoordinates[i+1]);

            var step = 0;
            var timePerStep = 100; // Change this to alter animation speed
            var multiplier = 2;
            var interval = setInterval(function() {
                if (step > (trailCoordinates.length - 1)) {
                    m.setMap(null);
                    clearInterval(interval);
                } else {
                    //var intLoc = google.maps.geometry.spherical.interpolate(trailCoordinates[i],trailCoordinates[i+1],step/multiplier);
                    var l = trailCoordinates[step];
                    m.setPosition(l);
                }
                step += 1;
            }, timePerStep);
        //}
    });
}

function addTowersHidden() {
    /*
    var towers = google.maps.Data({
        map: map,
        style: {icon: 'img/poi_tower_communications.n.0092DA.16.png'}
    });
    towers.loadGeoJson('data/towers.geojson');
    */
    map.data.setMap(null); // hide
    map.data.setStyle({icon: 'img/poi_tower_communications.n.0092DA.16.png'});
    map.data.loadGeoJson('data/towers.geojson');
    layers['layer-cell-towers'] = map.data;

    map.data.addListener('click', function(event) {
        var towerInfoWindow = new google.maps.InfoWindow({
        content: '<b>Tower ID:</b> 12957<br><b>Capabilities:</b> 900, 2100<br><b>Utilisation:</b> 32%<br><b>Status:</b> Operating Normally'
              });
        var anchor = new google.maps.MVCObject();
        anchor.set('position', event.feature.getGeometry().get());
        anchor.set('anchorPoint', new google.maps.Point(0, -12));
        towerInfoWindow.open(map, anchor);
    });
}

function layerToggle() {
    var layermap = layers[this.id].getMap();
    var setmap = map;
    if (layermap) {
        setmap = null;
    }

    if (this.checked) {
        layers[this.id].setMap(setmap);
    }else{
        layers[this.id].setMap(null);
    }
}

google.maps.event.addDomListener(window, 'load', initialise);

$("#customer-spend-range-slider").slider({
    tooltip: 'always',
    formater: function (v) {
        return '$' + v;
    },
    tooltip_separator: '-'
});

$("#customer-spend-range-slider").on('slide', function(e) {
    filterHeatmap();
});

function filterHeatmap() {
    var customerSpend = $("#customer-spend-range-slider").slider('getValue');

    var min = customerSpend[0];
    var max = customerSpend[1];

    if (max < 50) {
        if (heatmap[currentHour] != undefined) {
            if ($('#layer-dropped-calls-heatmap').is(':checked')) {
                heatmap[currentHour].setMap(null);
            }
        }
    } else {
        if (heatmap[currentHour] != undefined) {
            if ($('#layer-dropped-calls-heatmap').is(':checked')) {
                if (heatmap[currentHour].getMap() == null) {
                    heatmap[currentHour].setMap(map);
                }
            }
        }
    }
}

var trails = [];

function drawRecordTrail() {
    var trail = new google.maps.Polyline({
        path: trailCoordinates,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    var infowindow = new google.maps.InfoWindow({
        content: '<h4>Call Detail Record</h4><b>Call Duration: 1hr</b>'
    });

    google.maps.event.addDomListener(trail, 'click', function(e) {
        infowindow.setPosition(trail.getPath().getAt(0));
        infowindow.open(map);
        /*
        if (e.vertex) {
            infowindow.setPosition(trailCoordinates[e.vertex]);
        }else{
            if (e.edge) {
                infowindow.setPosition(trailCoordinates[e.vertex]);
            }else{
                // undefined
            }
        }
        */
    });
    trails.push(trail);
}

function toggleTrails() {
    var setmap = null;
    if ($('#layer-call-routes').is(':checked')) {
        setmap = map;
    }
    for (var i in trails) {
        trails[i].setMap(setmap);

    }
}
