#!/bin/sh

ogr2ogr \
    -f GeoJSON \
    -simplify 400 \
    TA2013_GV_Clipped_400m.geojson \
    'extracted/ESRI shapefile Output/2013 Digital Boundaries Generalised Clipped/TA2013_GV_Clipped.shp'
