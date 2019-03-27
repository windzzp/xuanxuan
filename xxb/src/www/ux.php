<?php
/**
 * The upgrade router file of XXB.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     XXB
 * @version     $Id: upgrade.php 3138 2015-11-09 07:32:18Z chujilu $
 * @link        http://xuan.im
 */
/* Judge my.php exists or not. */
define('RUN_MODE', 'upgrade');
$myConfig = dirname(dirname(__FILE__)) . '/config/my.php';
if(!file_exists($myConfig))
{
    echo "文件" . $myConfig . "不存在！ 提示：不要重命名原来的喧喧安装目录，下载最新的源码包，覆盖即可。" . "<br />";
    echo $myConfig . " doesn't exists! Please don't rename xxb before overriding the source code!";
    exit;
}

error_reporting(0);

/* Load the framework. */
include '../framework/router.class.php';
include '../framework/control.class.php';
include '../framework/model.class.php';
include '../framework/helper.class.php';

/* Instance the app. */
$app = router::createApp('xxb', dirname(dirname(__FILE__)));
$common = $app->loadCommon();

/* Reset the config params to make sure the upgrade program will be lauched. */
$config->set('requestType',    'GET');
$config->set('default.module', 'upgrade');
$config->set('default.method', 'upgradeXuanxuan');
$app->setDebug();

/* Check the installed version is the latest or not. */
$config->installedVersion = $common->loadModel('upgrade')->getXuanxuanVersion();
if(version_compare($config->xuanxuan->version, $config->installedVersion, '<=')) die(header('location: ../index.php'));

/* Run it. */
$app->parseRequest();
$app->loadModule();

/* Flush the buffer. */
echo helper::removeUTF8Bom(ob_get_clean());
