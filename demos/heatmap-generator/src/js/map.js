/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-33.86591, 151.20981),
    zoom: 15
};

var clicks = [];
var heatmapData = [];

var heatmap;

function initialise() {
    /* initialise the Google Map */
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    google.maps.event.addListener(map, 'click', function (e) {
        var selectedRange = { min: timeSlider.dateRangeSlider('min'), max: timeSlider.dateRangeSlider('max') };
        clicks.push(e.latLng.toString().substring(1, e.latLng.toString().length-2) + ',' + selectedRange['min'].toLocaleTimeString() + '-' + selectedRange['max'].toLocaleTimeString());
        heatmapData.push(e.latLng);

        if (heatmap != null) {
            heatmap.setMap(null);
        }
        heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                radius: 25
          });
        heatmap.setMap(map);
    });

}

google.maps.event.addDomListener(window, 'load', initialise);

function download() {
    var blob = new Blob([clicks.join("\n")], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "dataPoints.txt");
}
