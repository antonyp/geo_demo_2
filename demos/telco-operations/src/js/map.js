/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-36.84116, 174.79317),
    zoom: 10,
    styles: snazzy['subtlegrayscale']
    //styles: snazzy['subtlegrayscale']
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
               gradient: colorbrewer[colourRamp]["9"],
               radius: 15
           });
       });

    }
});

/* current start hour being displayed */
var currentHour = defaultStartHour;

var map;

function initialise() {
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    $('#layer-traffic').change(layerToggle);
    $('#layer-transit').change(layerToggle);

    $('#layer-network-issues').attr('checked', 'checked');
    if (heatmap[defaultStartHour] != undefined) {
        heatmap[defaultStartHour].setMap(map);
    }
    $('#layer-network-issues').change(function() {
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
                if ($('#layer-network-issues').is(':checked')) {
                    heatmap[currentHour].setMap(map);
                }
            }
        }
    });

    addTowersHidden();
    $('#layer-cell-towers').change(layerToggle);
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
