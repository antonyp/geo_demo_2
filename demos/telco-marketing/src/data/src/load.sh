#!/bin/sh

ogr2ogr -f PostgreSQL PG:dbname=statsnz mb_stats_gme.shp
