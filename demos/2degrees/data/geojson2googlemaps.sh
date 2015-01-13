#!/bin/sh

jq '.features[].geometry.coordinates[][]'| paste -s -d' \n' - | awk '{ print $2 " " $1 }' | sed 's/ /, /' | sed 's/^/new google.maps.LatLng\(/' | sed 's/$/),/'
