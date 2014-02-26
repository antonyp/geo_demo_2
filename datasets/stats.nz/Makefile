all: clean load-schema 

clean:
	psql -f src/drop_schema.sql

load-schema:
	psql -f src/create_schema.sql

load-stat:
	./src/load-stat.sh

join:
	psql -f src/join-geo-with-stats.sql

extract:
	mkdir -p shape-extracts
	#chmod shape-extracts && pgsql2shp andrewharvey statsnz.usually_resident_population_au
	cd shape-extracts && pgsql2shp -f usually_resident_population_au andrewharvey 'select   au2013_nam, population_2001, population_2001_per_land_unit, population_2006, population_2006_per_land_unit, population_2013, population_2013_per_land_unit, land_area, ST_MakeValid(ST_SimplifyPreserveTopology(geom, 2)) as geom FROM statsnz.usually_resident_population_au AS usually_resident_population_au;'
