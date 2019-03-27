<?php
/**
 * The loader of framework of XXB.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     LGPL
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     XXB
 * @version     $Id: loader.php 4001 2016-07-21 01:47:54Z liugang $
 * @link        http://xuan.im
 */
/* Set the error reporting. */
error_reporting(E_ALL);

/* Start output buffer. */
ob_start();

/* Define the run mode as front. */
define('RUN_MODE', 'front');

/* Load the framework. */
$frameworkRoot = dirname(__FILE__);
include "$frameworkRoot/router.class.php";
include "$frameworkRoot/control.class.php";
include "$frameworkRoot/model.class.php";
include "$frameworkRoot/helper.class.php";

/* Log the time and define the run mode. */
$startTime = getTime();

/* Run the app. */
$app = router::createApp($appName);
$common = $app->loadCommon();

/* Check the reqeust is getconfig or not. */
if(isset($_GET['mode']) && $_GET['mode'] == 'getconfig') die(helper::removeUTF8Bom($app->exportConfig()));

/* Check for need upgrade. */
if(RUN_MODE != 'upgrade')
{
    $config->installedVersion = $common->loadModel('setting')->getVersion();
    if(version_compare($config->version, $config->installedVersion, '>')) 
    {
        die(header('location: ' . commonModel::getSysURL() . rtrim($config->webRoot, 'sys/') . '/ux.php'));
    }
}

$app->parseRequest();
$common->checkPriv();
$app->loadModule();

/* Flush the buffer. */
echo helper::removeUTF8Bom(ob_get_clean());
