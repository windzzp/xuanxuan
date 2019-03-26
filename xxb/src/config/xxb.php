<?php
/**
 * The config file of XXB.
 *
 * Don't modify this file directly, copy the item to my.php and change it.
 *
 * @copyright   Copyright 2009-2017 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     config
 * @version     $Id: config.php 4211 2017-06-20 14:30:10Z pengjx $
 * @link        http://xuan.im
 */
$config->version   = '2.5.1';                // 喧喧的版本。 The version of XXB. Don't change it.
$config->buildDate = "build at Mon Mar 11 17:34:38 CST 2019";

/* 基本设置。Rangerteam basic settings. */
$config->sessionVar    = 'xid';              // 请求类型为GET：session变量名。         requestType=GET: the session var name.
$config->cookiePath    = '/';                // cookies路径分隔符。                       The path of cookies.
$config->checkVersion  = true;               // 是否自动检测新版本。                      Auto check for new version or not.
$config->timeout       = 30 * 1000;          // ajax请求超时时间，单位毫秒。              The timeout of ajax request.
$config->pingInterval  = 60;                 // 心跳请求发送间隔，单位秒。                The interval of ping request, seconds.
$config->customerLimit = 50;                 // 页面加载时载入客户的最大数量。            The maximum number of customers that are loaded when the page loads.
$config->searchLimit   = 50;                 // 使用ajax搜索客户时页面显示的最大条目数量。The maximum number of customers displays in search customer page.

/* Supported charsets. */
$config->charsets['zh-cn']['utf-8'] = 'UTF-8';
$config->charsets['zh-cn']['gbk']   = 'GBK';
$config->charsets['zh-tw']['utf-8'] = 'UTF-8';
$config->charsets['zh-tw']['big5']  = 'BIG5';
$config->charsets['en']['utf-8']    = 'UTF-8';

/* IP white list settings.*/
$config->ipWhiteList = '*';
$config->allowedTags = '<p><span><h1><h2><h3><h4><h5><em><u><strong><br><ol><ul><li><img><a><b><font><hr><pre><div><table><td><th><tr><tbody><embed><style>';

/* Tables for basic system. */
if(!defined('TABLE_ACTION'))    define('TABLE_ACTION',    '`' . $config->db->prefix . 'action`');
if(!defined('TABLE_BLOCK'))     define('TABLE_BLOCK',     '`' . $config->db->prefix . 'block`');
if(!defined('TABLE_CATEGORY'))  define('TABLE_CATEGORY',  '`' . $config->db->prefix . 'category`');
if(!defined('TABLE_CONFIG'))    define('TABLE_CONFIG',    '`' . $config->db->prefix . 'config`');
if(!defined('TABLE_CRON'))      define('TABLE_CRON',      '`' . $config->db->prefix . 'cron`');
if(!defined('TABLE_ENTRY'))     define('TABLE_ENTRY',     '`' . $config->db->prefix . 'entry`');
if(!defined('TABLE_FILE'))      define('TABLE_FILE',      '`' . $config->db->prefix . 'file`');
if(!defined('TABLE_GROUP'))     define('TABLE_GROUP',     '`' . $config->db->prefix . 'group`');
if(!defined('TABLE_GROUPPRIV')) define('TABLE_GROUPPRIV', '`' . $config->db->prefix . 'grouppriv`');
if(!defined('TABLE_HISTORY'))   define('TABLE_HISTORY',   '`' . $config->db->prefix . 'history`');
if(!defined('TABLE_LANG'))      define('TABLE_LANG',      '`' . $config->db->prefix . 'lang`');
if(!defined('TABLE_SSO'))       define('TABLE_SSO',       '`' . $config->db->prefix . 'sso`');
if(!defined('TABLE_USER'))      define('TABLE_USER',      '`' . $config->db->prefix . 'user`');
if(!defined('TABLE_USERGROUP')) define('TABLE_USERGROUP', '`' . $config->db->prefix . 'usergroup`');
if(!defined('TABLE_USERQUERY')) define('TABLE_USERQUERY', '`' . $config->db->prefix . 'userquery`');

/* The mapping list of object and tables. */
$config->objectTables['cron'] = TABLE_CRON;
$config->objectTables['user'] = TABLE_USER;
