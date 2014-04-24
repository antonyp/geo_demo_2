#!/bin/sh

cat fieldsToFix.txt | sed 's/^\(.*\)$/update mb_stats_gme set \1 = null where \1 = \'*\';/g' | psql statsnz
