XXB	= ../xxb/src
MODULE	= $(XXB)/module
APP	= ranzhi/app/sys
VERSION	= $(shell head -n 1 $(XXB)/VERSION)

all: ranzhi

ranzhi:
	mkdir -p $(APP)
	mkdir ranzhi/config
	mkdir ranzhi/db
	mkdir ranzhi/framework
	mkdir ranzhi/lib
	cp -r app ranzhi/
	cp -r www ranzhi/
	cp -r $(XXB)/config/ext ranzhi/config/
	cp -r $(XXB)/db/*xuanxuan*.sql ranzhi/db/
	cp -r $(XXB)/framework/xuanxuan.class.php ranzhi/framework/
	cp -r $(XXB)/lib/phpaes ranzhi/lib/
	cp -r $(MODULE)/chat $(APP)/
	cp -r $(MODULE)/action/ext/* $(APP)/action/ext/
	cp -r $(MODULE)/entry/ext/* $(APP)/entry/ext/
	cp -r $(MODULE)/setting/ext/* $(APP)/setting/ext/
	cp -r $(MODULE)/user/ext/* $(APP)/user/ext/
	cp -r $(MODULE)/common/ext/* $(APP)/common/ext/
	cp -r $(MODULE)/install/ext/* $(APP)/install/ext/
	cp -r $(MODULE)/upgrade/ext/* $(APP)/upgrade/ext/
	cp -r $(XXB)/www/ux.php ranzhi/www/
	cp -r $(XXB)/www/x.php ranzhi/www/
	for sql in `ls ranzhi/db/*xuanxuan*.sql`; do sed -i 's/xxb_/sys_/g' $$sql; done
	sed -i "/\$$config->xuanxuan->backend     = 'xxb';/c\\\$$config->xuanxuan->backend     = 'ranzhi';" ranzhi/config/ext/xuanxuan.php
	sed -i "/case '2.0.0'/a\\			\$$this->installSSOEntry();" $(APP)/upgrade/ext/model/xuanxuan.php
	sed -i "s/setItem('system.xuanxuan.global.version'/setItem('system.sys.xuanxuan.global.version'/g" $(APP)/upgrade/ext/model/xuanxuan.php
	sed -i "s/setItem('system.common.xuanxuan.key'/setItem('system.sys.common.xuanxuan.key'/g" $(APP)/upgrade/ext/model/xuanxuan.php
	sed -i "s/setItem(\"system.chat.settings.\$$account\"/setItem(\"system.sys.chat.settings.\$$account\"/g" $(APP)/chat/control.php
	sed -i "s/setItem(\$$user->account . '.common.lastLogin.' . \$$device/setItem(\$$user->account . '.sys.common.lastLogin.' . \$$device/g" $(APP)/chat/model.php
	sed -i "s/setItems('system.common.xuanxuan'/setItems('system.sys.common.xuanxuan'/g" $(APP)/setting/ext/control/xuanxuan.php
	sed -i "/\$$app = router::createApp/c\\\$$app = router::createApp('sys');" ranzhi/www/ux.php
	sed -i "/\$$app = router::createApp/c\\\$$app = router::createApp('sys', '', 'xuanxuan');" ranzhi/www/x.php
	sed -i "s/喧喧/然之/g" ranzhi/www/ux.php
	sed -i "s/xxb/sys/g" ranzhi/www/ux.php
	sed -i "s/xxb/sys/g" ranzhi/www/x.php
	# translate zh-cn files to zh-tw.
	cp -r $(XXB)/tools ranzhi/ && cd ranzhi/tools/ && php ./cn2tw.php
	rm -r ranzhi/tools
	# change mode.
	chmod -R 777 ranzhi/config
	chmod -R 777 ranzhi/www/data
	# compress it.
	zip -rm -9 xuanxuan.ranzhi.${VERSION}.zip ranzhi
