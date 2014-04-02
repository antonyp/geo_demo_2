#!/bin/bash

for i in `mdb-tables prism.mdb`; do 
    echo $i
    mdb-export prism.mdb $i > csv/$i.csv 
done
