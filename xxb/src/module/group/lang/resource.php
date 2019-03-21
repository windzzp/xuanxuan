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

/* App module group. */
$lang->appModule = new stdclass();

$lang->appModule->superadmin = array();
$lang->appModule->superadmin[] = 'adminUser';
$lang->appModule->superadmin[] = 'group';
$lang->appModule->superadmin[] = 'tree';
$lang->appModule->superadmin[] = 'entry';
$lang->appModule->superadmin[] = 'setting';
$lang->appModule->superadmin[] = 'tree';

$lang->appModule->sys = array();

/* Module order. */
$lang->moduleOrder[0]  = 'adminUser';
$lang->moduleOrder[10] = 'group';

$lang->moduleOrder[15] = 'entry';
$lang->moduleOrder[20] = 'setting';
$lang->moduleOrder[25] = 'tree';

$lang->resource = new stdclass();

/* User. */
$lang->resource->adminUser = new stdclass();
$lang->resource->adminUser->admin  = 'admin';
$lang->resource->adminUser->create = 'create';
$lang->resource->adminUser->edit   = 'edit';
$lang->resource->adminUser->delete = 'delete';
$lang->resource->adminUser->forbid = 'forbid';
$lang->resource->adminUser->active = 'active';

$lang->adminUser->methodOrder[10] = 'admin';
$lang->adminUser->methodOrder[15] = 'create';
$lang->adminUser->methodOrder[20] = 'edit';
$lang->adminUser->methodOrder[25] = 'delete';
$lang->adminUser->methodOrder[30] = 'forbid';
$lang->adminUser->methodOrder[35] = 'active';

/* Group. */
$lang->resource->group = new stdclass();
$lang->resource->group->browse       = 'browse';
$lang->resource->group->create       = 'create';
$lang->resource->group->edit         = 'edit';
$lang->resource->group->delete       = 'delete';
$lang->resource->group->managemember = 'manageMember';
$lang->resource->group->managepriv   = 'managePriv';

$lang->group->methodOrder[10] = 'browse';
$lang->group->methodOrder[15] = 'create';
$lang->group->methodOrder[20] = 'edit';
$lang->group->methodOrder[25] = 'delete';
$lang->group->methodOrder[30] = 'managemember';
$lang->group->methodOrder[35] = 'managepriv';

/* Tree. */
$lang->resource->tree = new stdclass();
$lang->resource->tree->browse   = 'browse';
$lang->resource->tree->children = 'children';
$lang->resource->tree->edit     = 'edit';
$lang->resource->tree->delete   = 'delete';

$lang->tree->methodOrder[0]  = 'browse';
$lang->tree->methodOrder[5]  = 'edit';
$lang->tree->methodOrder[10] = 'delete';
$lang->tree->methodOrder[15] = 'children';

/* Entry */
$lang->resource->entry = new stdclass();
$lang->resource->entry->admin    = 'admin';
$lang->resource->entry->create   = 'create';
$lang->resource->entry->edit     = 'edit';
$lang->resource->entry->delete   = 'delete';
$lang->resource->entry->category = 'category';

$lang->entry->methodOrder[10] = 'admin';
$lang->entry->methodOrder[15] = 'create';
$lang->entry->methodOrder[20] = 'edit';
$lang->entry->methodOrder[25] = 'delete';
$lang->entry->methodOrder[30] = 'category';

/* Setting. */
$lang->resource->setting = new stdclass();
$lang->resource->setting->lang             = 'lang';
$lang->resource->setting->xuanxuan         = 'xuanxuan';
$lang->resource->setting->lang             = 'lang';
$lang->resource->setting->xxcversion       = 'xxcversion';
$lang->resource->setting->createxxcversion = 'createxxcversion';
$lang->resource->setting->editxxcversion   = 'editxxcversion';
$lang->resource->setting->deletexxcversion = 'deletexxcversion';

$lang->setting->methodOrder[5]  = 'lang';
$lang->setting->methodOrder[10] = 'xuanxuan';
$lang->setting->methodOrder[15] = 'xxcversion';
$lang->setting->methodOrder[20] = 'createxxcversion';
$lang->setting->methodOrder[25] = 'editxxcversion';
$lang->setting->methodOrder[30] = 'deletexxcversion';

/* Tree. */
$lang->resource->tree = new stdclass();
$lang->resource->tree->browse   = 'browse';
$lang->resource->tree->edit     = 'edit';
$lang->resource->tree->children = 'children';
$lang->resource->tree->delete   = 'delete';

$lang->tree->methodOrder[0]  = 'browse';
$lang->tree->methodOrder[5]  = 'edit';
$lang->tree->methodOrder[10] = 'children';
$lang->tree->methodOrder[15] = 'delete';

/* File. */
$lang->resource->file = new stdclass();
$lang->resource->file->upload   = 'upload';
$lang->resource->file->download = 'download';
$lang->resource->file->edit     = 'edit';
$lang->resource->file->delete   = 'delete';

$lang->file->methodOrder[0]  = 'upload';
$lang->file->methodOrder[5]  = 'download';
$lang->file->methodOrder[10] = 'edit';
$lang->file->methodOrder[15] = 'delete';

/* Cron. */
$lang->resource->cron = new stdclass();
$lang->resource->cron->index  = 'index';
$lang->resource->cron->create = 'create';
$lang->resource->cron->edit   = 'edit';
$lang->resource->cron->delete = 'delete';
$lang->resource->cron->turnon = 'turnon';
$lang->resource->cron->toggle = 'toggle';

$lang->cron->methodOrder[10] = 'index';
$lang->cron->methodOrder[15] = 'create';
$lang->cron->methodOrder[20] = 'edit';
$lang->cron->methodOrder[25] = 'delete';
$lang->cron->methodOrder[30] = 'turnon';
$lang->cron->methodOrder[35] = 'toggle';

/* Every version of new privilege. */
$lang->changelog = array();
//$lang->changelog['1.1'][]   = 'search-saveQuery';
