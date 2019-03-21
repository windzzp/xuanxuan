<?php
/**
 * The config file of user module of XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     user 
 * @version     $Id: config.php 4029 2016-08-26 06:50:41Z liugang $
 * @link        http://xuan.im
 */
$config->user->require = new stdclass();
$config->user->require->create = 'account,realname,email';
$config->user->require->edit   = 'realname,email';

$config->user->retainAccount = array('guest', 'default');
