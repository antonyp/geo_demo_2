all: clean cut

clean:
	rm -r nz-primary-parcels nz-property-titles

cut:
	ogr2ogr \
	    -overwrite \
	    -spat 174.88 -36.878 174.941 -36.849 \
	    nz-primary-parcels ~/data/linz/nz-primary-parcels/nz-primary-parcels-1.shp
	
	ogr2ogr \
	    -overwrite \
	    -spat 174.88 -36.878 174.941 -36.849 \
	    nz-property-titles ~/data/linz/nz-property-titles/nz-property-titles-2.shp
