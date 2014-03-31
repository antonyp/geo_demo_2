var bookingLoc = new google.maps.LatLng(-28.00305, 153.42476);
var parcelInfoWindow = false;

var currentStep = 0;

$('#next-btn').click(function () {
    switch (currentStep) {
        case 1:
            $('#newbooking-modal').modal('hide');
            break;
        case 2:
            focus_infowindow.close();
            step3();
            break;
        case 3:
            step3_infowindow.close();
            step4();
            break;
        case 4:
            $('#courier-notified-modal').modal('hide');
            break;
    }
});

// STEP 0 - Start
$('#start-btn').click(function () {
    var btn = $(this);

    // change the button state to indicated that we've registered the
    // click and are doing something
    btn.button('loading');

    // set what to do once the animation ends
    btn.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step1);

    // animate out the button
    btn.addClass('animated bounceOutLeft');
    if ($.browser.mozilla) {
        step1();
    }
});

// STEP 1 - New booking lodged in queue
function step1() {
    // when the animation ends start the next step
    $('#step1-new-booking-desc').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step1_modal);

    // animate in the list item
    $('#step1-new-booking-desc').addClass('animated bounceInLeft');
    $('#step1-new-booking-desc').removeClass('hide');
}


function step1_modal() {
    currentStep = 1;
    $('#next-btn').addClass('animated bounceInUp');
    $('#next-btn').removeClass('hide');

    // show the modal
    $('#newbooking-modal').modal({show: true});
    $('.modal-backdrop').removeClass("modal-backdrop");

    /*
       var newbooking = $('#new-booking-desc').popover({
       placement: 'right',
       trigger: 'manual'
       });
       newbooking.popover('show');
    */

    // when the user closes it start the next step
    $('#newbooking-modal').on('hidden.bs.modal', step2);
}

function step2() {
    currentStep = 2;

    $('#step1-new-booking-desc').addClass('text-muted');

    $('#step2-geocoded-desc').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step2_marker);
    $('#step2-geocoded-desc').addClass('animated bounceInLeft');
    $('#step2-geocoded-desc').removeClass('hide');
}

var focus_marker;
function step2_marker() {
        focus_marker = new google.maps.Marker({
            position: bookingLoc,
            map: map,
            title:"Booking #1234",
            animation: google.maps.Animation.DROP
        });
        map.panTo(bookingLoc);
        google.maps.event.addListener(focus_marker, 'animation_changed', step2_infowindow);
}

var focus_infowindow;
// load the marker info window
function step2_infowindow(animation) {
    if ((animation == null) && (parcelInfoWindow == false) && (focus_marker != null)) {
        // to prevent double opening
        parcelInfoWindow = true;

        var contentString = "Parcel #1639120";
        focus_infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        // what to do when the user closes the info window
        google.maps.event.addListener(focus_infowindow, 'closeclick', step3);

        focus_infowindow.open(map, focus_marker);
    }
}

function step3() {
    currentStep = 3;

    $('#step2-geocoded-desc').addClass('text-muted');

    $('#step3-geospatial-operation-desc').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step3_zones);
    $('#step3-geospatial-operation-desc').addClass('animated bounceInLeft');
    $('#step3-geospatial-operation-desc').removeClass('hide');
}

var step3_infowindow;

function step3_zones() {
    map.data.loadGeoJson('data/SurfersParadise_SSC.geojson');
        var contentString = '<h3>Couriers in this Zone</h3>' +
            '<ul>' +
            '  <li class="text-primary"><b>John Smith (Assigning...)</b></li>' +
            '  <li>Bob Toon</li>' +
            '  <li class="text-muted">Jane Doe (Unavailiable)</li>' +
            '</ul>';
        step3_infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        // what to do when the user closes the info window
        google.maps.event.addListener(step3_infowindow, 'closeclick', step4);

        step3_infowindow.open(map, focus_marker);
}

function step4() {
    currentStep = 4;

    $('#step3-geospatial-operation-desc').addClass('text-muted');

    $('#step4-courier-notified-desc').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step4_modal);
    $('#step4-courier-notified-desc').addClass('animated bounceInLeft');
    $('#step4-courier-notified-desc').removeClass('hide');
}

function step4_modal() {
    // show the modal
    $('#courier-notified-modal').modal({show: true});
    $('.modal-backdrop').removeClass("modal-backdrop");

    // when the user closes it start the next step
    $('#courier-notified-modal').on('hidden.bs.modal', step5);
}

function step5() {
    currentStep = 5;

    map.data.forEach(function (f) {
        map.data.remove(f);
    });
    $('#step4-courier-notified-desc').addClass('text-muted');

    $('#step5-visualisation-desc').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', step6);
    $('#step5-visualisation-desc').addClass('animated bounceInLeft');
    $('#step5-visualisation-desc').removeClass('hide');
}

var openInfoWindows = [];
function step6() {
    $('#next-btn').removeClass('animated bounceInUp');
    $('#next-btn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('#next-btn').addClass('hide');
    });
    $('#next-btn').addClass('animated bounceOutDown');

    /*
    var suburbsLayer = new google.maps.visualization.DynamicMapsEngineLayer({
        layerId: '14243126420781440025-06900458292272798243',
        map: map,
        suppressInfoWindows: true,
        clickable: true
    });
    */

    var suburbsLayer = new google.maps.visualization.DynamicMapsEngineLayer({
        layerId: '14243126420781440025-15989983115440808490', /* territories */
        map: map,
        suppressInfoWindows: false,
        clickable: true
    });

    google.maps.event.addListener(suburbsLayer, 'mouseover', function(e) {
          var style = suburbsLayer.getFeatureStyle(e.featureId);
          style.strokeColor = 'red';
          style.strokeWidth = 3;
          style.fillColor = 'red';
          style.fillOpacity = 0.3;
    });

    google.maps.event.addListener(suburbsLayer, 'mouseout', function(e) {
          suburbsLayer.getFeatureStyle(e.featureId).resetAll();
    });

    /*
    google.maps.event.addListener(suburbsLayer, 'click', function(e) {
        var contentString = '<h3>Courier Zone - ' + chance.city() + '</h3>' +
        '<ul>' +
        '  <li>' + chance.name() + ' - <a href="tel:' + chance.phone() + '">' + chance.phone() + '</a></li>' +
        '  <li>' + chance.name() + ' - <a href="tel:' + chance.phone() + '">' + chance.phone() + '</a></li>' +
        '  <li>' + chance.name() + ' - <a href="tel:' + chance.phone() + '">' + chance.phone() + '</a></li>' +
        '  <li>' + chance.name() + ' - <a href="tel:' + chance.phone() + '">' + chance.phone() + '</a></li>' +
        '</ul>';
        var infowindow = new google.maps.InfoWindow({
            position: e.latLng,
            content: contentString
        });

        openInfoWindows.forEach(function (i) {
            i.close();
        });

        // what to do when the user closes the info window
        google.maps.event.addListener(infowindow, 'closeclick', step4);

        infowindow.open(map);

        openInfoWindows.push(infowindow);
    });
    */


    var randomPointsWithinView = [];
    randomPoints.forEach(function(i) {
        var loc = new google.maps.LatLng(i[1], i[0]);
        if (map.getBounds().contains(loc)) {
            randomPointsWithinView.push(loc);
        }
    });

    var mapsIcons = [
        'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            ];

    randomPointsWithinView.forEach(function (value, index) {
        setTimeout(function() {
            var m = new google.maps.Marker({
                icon: mapsIcons[chance.natural({min: 0, max: 3})],
                position: value,
                map: map,
                animation: google.maps.Animation.DROP
            });

            var contentString = "Parcel #" + chance.natural({min: 0, max: 999999});
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            // what to do when the user closes the info window
            google.maps.event.addListener(m, 'click', function() {
                infowindow.open(map, m);
            });

        }, index * 50);
    });
};
