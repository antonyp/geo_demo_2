#!/bin/sh

for f in png_src/*/*.png ; do
    b=`echo "$f" | sed s/png_src/gme_icon/`
    bn=`dirname "$b"`
    mkdir -p "$bn"
    convert -resize '32x32' "$f" "$b"
done
