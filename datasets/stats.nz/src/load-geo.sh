#!/bin/sh

shp2pgsql extracted/ESRI\ shapefile\ Output/2013\ Digital\ Boundaries\ Generalised\ Full/AU2013_GV_Full.shp statsnz.au | psql
