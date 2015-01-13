  var MAP_STYLE = [
    {
      "stylers":[
        {
          "weight":0.1
        },
        {
          "saturation":-100
        },
        {
          "lightness":18
        },
        {
          "gamma":0.75
        }
      ]
    }
  ];

var ROADS_STYLE = [
    {
      "elementType":"labels",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"administrative",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"poi",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"transit",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"landscape",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "weight":".5"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "elementType":"geometry.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "elementType":"geometry.stroke",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "elementType":"labels.icon",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "gamma":"0.32"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        }
      ]
    },
    {
      "featureType":"road.highway",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "weight":".3"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"geometry.fill",
      "stylers":[
        {
          "visibility":"simplified"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"geometry.stroke",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"labels.icon",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "gamma":"0.32"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        }
      ]
    },
    {
      "featureType":"road.arterial",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"road.local",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "weight":".3"
        }
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"geometry.fill",
      "stylers":[
        {
          "visibility":"simplified"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"geometry.stroke",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#bebebe"
        }
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"labels.icon",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "gamma":"0.32"
        }
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        }
      ]
    },
    {
      "featureType":"road.local",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType":"administrative.country",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        }
      ]
    },
    {
      "featureType":"administrative.country",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#FFFFFF"
        }
      ]
    },
    {
      "featureType":"administrative.province",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        }
      ]
    },
    {
      "featureType":"administrative.province",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#FFFFFF"
        }
      ]
    },
    {
      "featureType":"administrative.locality",
      "elementType":"labels.text.fill",
      "stylers":[
        {
          "visibility":"on"
        },
        {
          "color":"#000000"
        },
        {
          "weight":"2"
        }
      ]
    },
    {
      "featureType":"administrative.locality",
      "elementType":"labels.text.stroke",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers":[
        {
          "visibility":"off"
        }
      ]
    }
  ];

/* Google Map default options */
var mapOptions = {
    center: new google.maps.LatLng(-36.84116, 174.79317),
    zoom: 13
    //styles: MAP_STYLE
};

var map;
  

function initialise() {
    /* initialise the Google Map */
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    /* create xg-signal-strength but don't add to map initially */
    var coverageGME = new google.maps.visualization.MapsEngineLayer({
                layerId: '14243126420781440025-06423057872183631348',
                map: map,
                suppressInfoWindows: true,
                clickable: false,
                zIndex: 0
            });
    
    coverageGME.setOpacity(1.0);

    var coverageTypeOptions = {
        getTileUrl: function(coord, zoom) {
                        return 'https://catchnz.s3.amazonaws.com/tiles-2/l18/' + ([zoom, coord.x, coord.y].join('/')) + '.png';
                    },
        tileSize: new google.maps.Size(256, 256)
    };

    var coverageMapType = new google.maps.ImageMapType(coverageTypeOptions);
    coverageMapType.setOpacity(1.0);

    //map.setOptions({styles: MAP_STYLE});

    map.overlayMapTypes.insertAt(0, new google.maps.StyledMapType(MAP_STYLE));
    //map.overlayMapTypes.insertAt(1, coverageGME);
    //map.overlayMapTypes.insertAt(1, coverageMapType);
    map.overlayMapTypes.insertAt(1, new google.maps.StyledMapType(ROADS_STYLE));

}

google.maps.event.addDomListener(window, 'load', initialise);
