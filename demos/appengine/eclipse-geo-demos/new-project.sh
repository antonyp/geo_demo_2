#!/bin/sh

if [[ -z $1 ]] ; then
    echo "Usage: $0 project-name"
    exit 1
else
    cp -R barb-template-project "$1"
    sed -i -e s/barb-template-project/$1/g "$1/war/WEB-INF/appengine-web.xml"
    rm -R "$1/war/WEB-INF/lib"
    cd "$1/war/WEB-INF/"
    ln -s ../../../barb-template-project/war/WEB-INF/lib lib
    echo "New project $1 created."
    echo "Now you should create some symlinks to your actual content"
fi
