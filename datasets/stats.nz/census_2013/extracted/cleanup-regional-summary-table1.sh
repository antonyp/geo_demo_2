#!/bin/sh

echo 'Territorial authority area or Auckland local board area,Age group,2006 Census Male,2006 Census Female,2006 Census Total people,2013 Census Male,2013 Census Female,2013 Census Total people' > cleaned/regional-summary-table1.csv

cat copy-pasted/regional-summary-table1.csv | \
    grep -v '^,,,,,,$' | \
    sed 's/,,,,,,$//' | \
    grep -v '^\"Total people' | \
    sed 's/\.\.C//g' | \
    ./table1-fix.pl \
    >> cleaned/regional-summary-table1.csv
