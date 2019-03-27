<?php 
/**
 * The sys app router file of XXB.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     XXB
 * @version     $Id: index.php 3138 2015-11-09 07:32:18Z chujilu $
 * @link        http://xuan.im
 */
/* Set the error reporting. */
error_reporting(E_ALL);

/* Start output buffer. */
ob_start();

/* Define the run mode as front. */
define('RUN_MODE', 'front');

/* Load the framework. */
include '../framework/router.class.php';
include '../framework/control.class.php';
include '../framework/model.class.php';
include '../framework/helper.class.php';

/* Log the time and define the run mode. */
$startTime = getTime();

/* Run the app. */
$app = router::createApp('xxb', dirname(dirname(__FILE__)));

/* installed or not. */
if(!isset($config->installed) or !$config->installed) die(header('location: install.php'));

$common = $app->loadCommon();

/* Check the reqeust is getconfig or not. */
if(isset($_GET['mode']) && $_GET['mode'] == 'getconfig') die(helper::removeUTF8Bom($app->exportConfig()));

/* Check for need upgrade. */
if(RUN_MODE != 'upgrade')
{
    $config->installedVersion = $common->loadModel('setting')->getVersion();
    if(version_compare($config->version, $config->installedVersion, '>'))
    {
        die(header('location: ' . commonModel::getSysURL() . $config->webRoot . 'ux.php'));
    }
}

$app->parseRequest();
$common->checkPriv();
$app->loadModule();

/* Flush the buffer. */
echo helper::removeUTF8Bom(ob_get_clean());
