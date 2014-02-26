#!/bin/sh

echo 'area_unit_code,area_unit_name,2001,2006,2013' \
    > cleaned/usually-resident-population-count-by-area-unit.csv

cat copy-pasted/usually-resident-population-count-by-area-unit.csv | \
    csvfix remove -f 1 -e '^$' | \
    csvfix edit -e 's/^\-$//g' -f 2,3,4 | \
    sed -E 's/^\"([0-9]+) /"\1","/' | \
    csvfix echo -smq \
    >> cleaned/usually-resident-population-count-by-area-unit.csv

    #csvfix edit -e 's/\s/	/' -f 1 | \
    #csvfix split_char -f 1 -c '	' \
