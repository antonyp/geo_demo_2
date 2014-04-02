all: get unzip extract

get:
	wget 'http://www.rsm.govt.nz/cms/pdf-library/resource-library/spectrum-search-lite/spectrum-search-lite-database'

unzip:
	unzip spectrum-search-lite-database
	rm -f spectrum-search-lite-database

extract:
	mkdir -p csv
	./extract.sh

clean:
	rm -f prism.mdb
	rm -rf csv
