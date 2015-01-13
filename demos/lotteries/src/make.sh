#!/bin/bash

output=js/templateStrings.js

echo 'var templateString = {};' > $output

for i in $*
do
    echo -n "templateString['$i'] = '" >> $output
    cat "templates/$i.html" | tr -d '\n' >> $output
    echo "';" >> $output
done
