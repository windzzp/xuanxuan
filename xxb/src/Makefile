VERSION=$(shell head -n 1 VERSION)
TIME=$(shell date)

all: xxb

xxb:
	mkdir xxb
	cp -r config xxb/
	cp -r db xxb/
	cp -r doc xxb/
	cp -r framework xxb/
	cp -r lib xxb/
	cp -r module xxb/
	cp -r tools xxb/
	cp -r www xxb/
	cp -r VERSION xxb/
	echo '$$config->buildDate = "build at $(TIME)";' >> xxb/config/xxb.php
	# combine js and css files.
	cd xxb/tools/ && php ./minifyfront.php && php ./cn2tw.php
	# Add ext directory to config and each module.
	test -d xxb/config/ext || mkdir xxb/config/ext
	for module in `ls xxb/module/`; do test -d xxb/module/$$module/ext || mkdir xxb/module/$$module/ext; done
	find xxb -name ext | xargs chmod -R 777
	# Add index.html to each directory.
	for path in `find xxb -type d`; do touch "$$path/index.html"; done	
	# Delete the useless files.
	find xxb -name .git | xargs rm -fr
	rm -rf xxb/tools
	rm xxb/www/index.html
	#rm xxb/www/ux.php
	sed -i '/upgradeXuanxuan/d' xxb/www/ux.php
	# Make tmp directories.
	mkdir xxb/tmp/
	mkdir xxb/tmp/backup/
	mkdir xxb/tmp/log/
	mkdir xxb/tmp/model/
	mkdir xxb/www/data
	mkdir xxb/www/data/client
	# Change mode.
	chmod -R 777 xxb/config
	chmod -R 777 xxb/tmp
	chmod -R 777 xxb/www/data
	# Zip it.
	zip -rqm -9 xxb.$(VERSION).zip xxb
deb:
	mkdir ~/buildroot
	cp -r build/debian/DEBIAN ~/buildroot
	sed -i '/^Version/cVersion: ${VERSION}' ~/buildroot/DEBIAN/control
	mkdir -p ~/buildroot/opt
	mkdir -p ~/buildroot/etc/apache2/sites-enabled
	cp build/debian/xxb.conf ~/buildroot/etc/apache2/sites-enabled/
	cp xxb.${VERSION}.zip ~/buildroot/opt/
	cd ~/buildroot/opt; unzip xxb.${VERSION}.zip; rm xxb.${VERSION}.zip
	#sed -i 's/index.php/\/xxb\/sys\/index.php/' ~/buildroot/opt/xxb/www/sys/.htaccess
	#sed -i 's/index.php/\/xxb\/oa\/index.php/' ~/buildroot/opt/xxb/www/oa/.htaccess
	sudo dpkg -b ~/buildroot/ xxb_${VERSION}_1_all.deb
	rm -rf ~/buildroot

rpm:
	mkdir -p ~/rpmbuild/SPECS
	cp build/rpm/xxb.spec ~/rpmbuild/SPECS
	sed -i '/^Version/cVersion:${VERSION}' ~/rpmbuild/SPECS/xxb.spec
	mkdir -p ~/rpmbuild/SOURCES
	cp xxb.${VERSION}.zip ~/rpmbuild/SOURCES
	mkdir -p ~/rpmbuild/SOURCES/etc/httpd/conf.d/
	cp build/debian/xxb.conf ~/rpmbuild/SOURCES/etc/httpd/conf.d/
	mkdir -p ~/rpmbuild/SOURCES/opt/
	cd ~/rpmbuild/SOURCES; unzip xxb.${VERSION}.zip; mv xxb opt/
	#sed -i 's/index.php/\/xxb\/sys\/index.php/' ~/rpmbuild/SOURCES/opt/xxb/www/sys/.htaccess
	#sed -i 's/index.php/\/xxb\/oa\/index.php/' ~/rpmbuild/SOURCES/opt/xxb/www/oa/.htaccess
	cd ~/rpmbuild/SOURCES; tar -czvf xxb.${VERSION}.tar.gz etc opt; rm -rf xxb.${VERSION}.zip etc opt
	rpmbuild -ba ~/rpmbuild/SPECS/xxb.spec
	cp ~/rpmbuild/RPMS/noarch/xxb-${VERSION}-1.noarch.rpm ./
	rm -rf ~/rpmbuild

