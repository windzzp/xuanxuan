<?php
/**
 * The config items for rights.
 *
 * @copyright   Copyright 2009-2015 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Tingting Dai <daitingting@xirangit.com>
 * @package     config
 * @version     $Id$
 * @link        http://xuan.im
 */
/* Init the rights. */
$config->rights = new stdclass();

$config->rights->guest = array();

$config->rights->member['index']['index']           = 'index';
$config->rights->member['entry']['visit']           = 'visit';
$config->rights->member['entry']['blocks']          = 'blocks';
$config->rights->member['entry']['setblock']        = 'setblock';
$config->rights->member['entry']['printblock']      = 'printblock';
$config->rights->member['entry']['customsort']      = 'customsort';
$config->rights->member['entry']['updateentrymenu'] = 'updateentrymenu';

$config->rights->member['user']['profile']        = 'profile';
$config->rights->member['user']['thread']         = 'thread';
$config->rights->member['user']['reply']          = 'reply';
$config->rights->member['user']['message']        = 'message';
$config->rights->member['user']['setreferer']     = 'setreferer';
$config->rights->member['user']['changepassword'] = 'changepassword';
$config->rights->member['user']['vcard']          = 'vcard';
$config->rights->member['user']['uploadavatar']   = 'uploadavatar';
$config->rights->member['user']['cropavatar']     = 'cropavatar';
$config->rights->member['user']['editself']       = 'editself';

$config->rights->member['search']['buildform']   = 'buildform';
$config->rights->member['search']['buildquery']  = 'buildquery';
$config->rights->member['search']['savequery']   = 'savequery';
$config->rights->member['search']['deletequery'] = 'deletequery';

$config->rights->member['misc']['qrcode']        = 'qrcode';
$config->rights->member['misc']['about']         = 'about';
$config->rights->member['tree']['redirect']      = 'redirect';

$config->rights->member['action']['createrecord'] = 'createrecord';
$config->rights->member['action']['editrecord']   = 'editrecord';
$config->rights->member['action']['history']      = 'history';
$config->rights->member['action']['editcomment']  = 'editcomment';
$config->rights->member['action']['read']         = 'read';

$config->rights->member['file']['buildform']      = 'buildform';
$config->rights->member['file']['buildlist']      = 'buildlist';
$config->rights->member['file']['printfiles']     = 'printfiles';
$config->rights->member['file']['ajaxupload']     = 'ajaxupload';
$config->rights->member['file']['browse']         = 'browse';
$config->rights->member['file']['senddownheader'] = 'senddownheader';
$config->rights->member['file']['ajaxpasteimage'] = 'ajaxpasteimage';
$config->rights->member['file']['filemanager']    = 'filemanager';
$config->rights->member['file']['sort']           = 'sort';
