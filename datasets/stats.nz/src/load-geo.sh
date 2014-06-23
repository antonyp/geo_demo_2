#!/bin/sh

shp2pgsql extracted/ESRI\ shapefile\ Output/2013\ Digital\ Boundaries\ Generalised\ Clipped/AU2013_GV_Clipped.shp statsnz.au | psql
shp2pgsql extracted/ESRI\ shapefile\ Output/2013\ Digital\ Boundaries\ Generalised\ Clipped/MB2013_GV_Clipped.shp statsnz.mb | psql

