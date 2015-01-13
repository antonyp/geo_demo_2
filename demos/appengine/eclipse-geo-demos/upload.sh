#!/bin/sh

if [[ -z $1 ]] ; then
    echo "Usage: $0 project-name"
    exit 1
else
    /Applications/eclipse/plugins/com.google.appengine.eclipse.sdkbundle_1.8.9/appengine-java-sdk-1.8.9/bin/appcfg.sh --email=andrew.harvey@barbador.com update $1/war
fi
