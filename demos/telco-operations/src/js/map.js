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
    url: "data/dataPoints.txt",
    success: function (csv) {
       allSamples = $.csv.toArrays(csv);
       allSamples.forEach(function(i) {
           var loc = new google.maps.LatLng(i[0], i[1]);
           var startHour = i[2].split('-')[0].split(':')[0];
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
