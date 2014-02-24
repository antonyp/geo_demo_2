all : clean unzip resize

clean :
	rm -fr png_src gme_icon

unzip :
	mkdir -p png_src
	for f in zips/* ; do \
	    b=`basename $$f .zip` ; \
	    mkdir -p png_src/$$b/ ; \
	    unzip $$f -d png_src/$$b/ ; \
	done

resize :
	./resize.sh
