#!/usr/local/bin/bash

for i in {0..60..5} ; do
    r=${i}_$((${i}+4))
    echo "    UPDATE mb_stats_gme SET den_$r = urp_$r / land_area_;"
done
echo "    UPDATE mb_stats_gme SET den_65ov = urp_65ov / land_area_;"
