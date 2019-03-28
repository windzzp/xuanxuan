<?php
$config->upgrade = new stdclass();
$config->delete  = array();
$config->delete['2.5.0'][] = 'app';
$config->delete['2.5.0'][] = 'www/sys';
$config->delete['2.5.0'][] = 'config/ext/xxb.php';
$config->delete['2.5.0'][] = 'framework/loader.php';
$config->delete['2.5.0'][] = 'tmp/model/common.php';
$config->delete['2.5.0'][] = 'tmp/model/install.php';
$config->delete['2.5.0'][] = 'tmp/model/upgrade.php';
$config->delete['2.5.0'][] = 'tmp/model/user.php';
