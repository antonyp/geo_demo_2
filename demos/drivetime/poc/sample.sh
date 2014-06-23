#!/bin/sh

mkdir -p output

./drivetime.pl | m4b-signature | wget -O output/result.json -i -

echo 'value' > output/values.txt
cat output/result.json | jq '.rows[].elements[].duration.value' >> output/values.txt

paste -d',' output/dest.csv output/values.txt > drivetime.csv
