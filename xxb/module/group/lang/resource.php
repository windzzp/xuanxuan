<?php
/**
 * The all avaliabe actions in XXB.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     group
 * @version     $Id$
 * @link        http://xuan.im
 */

/* Module order. */
$lang->moduleOrder[5]  = 'client';
$lang->moduleOrder[10] = 'entry';
$lang->moduleOrder[15] = 'group';
$lang->moduleOrder[20] = 'file';
$lang->moduleOrder[25] = 'setting';
$lang->moduleOrder[30] = 'tree';
$lang->moduleOrder[35] = 'user';

$lang->resource = new stdclass();

/* Client. */
$lang->resource->client = new stdclass();
$lang->resource->client->browse       = 'browse';
$lang->resource->client->create       = 'create';
$lang->resource->client->edit         = 'edit';
$lang->resource->client->delete       = 'delete';
$lang->resource->client->checkUpgrade = 'checkUpgrade';

$lang->client->methodOrder[5]  = 'browse';
$lang->client->methodOrder[10] = 'create';
$lang->client->methodOrder[15] = 'edit';
$lang->client->methodOrder[20] = 'delete';
$lang->client->methodOrder[25] = 'checkUpgrade';

/* Entry */
$lang->resource->entry = new stdclass();
$lang->resource->entry->admin    = 'admin';
$lang->resource->entry->create   = 'create';
$lang->resource->entry->edit     = 'edit';
$lang->resource->entry->delete   = 'delete';
$lang->resource->entry->category = 'category';

$lang->entry->methodOrder[5]  = 'admin';
$lang->entry->methodOrder[10] = 'create';
$lang->entry->methodOrder[15] = 'edit';
$lang->entry->methodOrder[20] = 'delete';
$lang->entry->methodOrder[25] = 'category';

/* Group. */
$lang->resource->group = new stdclass();
$lang->resource->group->browse       = 'browse';
$lang->resource->group->create       = 'create';
$lang->resource->group->edit         = 'edit';
$lang->resource->group->delete       = 'delete';
$lang->resource->group->managemember = 'manageMember';
$lang->resource->group->managepriv   = 'managePriv';

$lang->group->methodOrder[5]  = 'browse';
$lang->group->methodOrder[10] = 'create';
$lang->group->methodOrder[15] = 'edit';
$lang->group->methodOrder[20] = 'delete';
$lang->group->methodOrder[25] = 'managemember';
$lang->group->methodOrder[30] = 'managepriv';

/* Setting. */
$lang->resource->setting = new stdclass();
$lang->resource->setting->lang     = 'lang';
$lang->resource->setting->xuanxuan = 'xuanxuan';

$lang->setting->methodOrder[5]  = 'lang';
$lang->setting->methodOrder[10] = 'xuanxuan';

/* File. */
$lang->resource->file = new stdclass();
$lang->resource->file->upload   = 'upload';
$lang->resource->file->download = 'download';
$lang->resource->file->edit     = 'edit';
$lang->resource->file->delete   = 'delete';

$lang->file->methodOrder[5]  = 'upload';
$lang->file->methodOrder[10] = 'download';
$lang->file->methodOrder[15] = 'edit';
$lang->file->methodOrder[20] = 'delete';

/* Tree. */
$lang->resource->tree = new stdclass();
$lang->resource->tree->browse   = 'browse';
$lang->resource->tree->edit     = 'edit';
$lang->resource->tree->children = 'children';
$lang->resource->tree->delete   = 'delete';

$lang->tree->methodOrder[5]  = 'browse';
$lang->tree->methodOrder[10] = 'edit';
$lang->tree->methodOrder[15] = 'children';
$lang->tree->methodOrder[20] = 'delete';

/* User. */
$lang->resource->user = new stdclass();
$lang->resource->user->admin  = 'admin';
$lang->resource->user->create = 'create';
$lang->resource->user->edit   = 'edit';
$lang->resource->user->delete = 'delete';
$lang->resource->user->forbid = 'forbid';
$lang->resource->user->active = 'active';

$lang->user->methodOrder[5]  = 'admin';
$lang->user->methodOrder[10] = 'create';
$lang->user->methodOrder[15] = 'edit';
$lang->user->methodOrder[20] = 'delete';
$lang->user->methodOrder[25] = 'forbid';
$lang->user->methodOrder[30] = 'active';

/* Every version of new privilege. */
$lang->changelog = array();
//$lang->changelog['1.1'][]   = 'search-saveQuery';
