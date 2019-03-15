<?php
/**
 * The action module English file of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     action
 * @version     $Id: zh-cn.php 4955 2013-07-02 01:47:21Z chencongzhi520@gmail.com $
 * @link        http://www.zdoo.org
 */
if(!isset($lang->action)) $lang->action = new stdclass();

$lang->action->common   = 'Logs';
$lang->action->product  = 'Product';
$lang->action->actor    = 'Account';
$lang->action->contact  = 'Contact';
$lang->action->comment  = 'Comment';
$lang->action->action   = 'Action';
$lang->action->actionID = 'Action ID';
$lang->action->date     = 'Date';

$lang->action->trash      = 'Trash';
$lang->action->objectType = 'Type';
$lang->action->objectID   = 'ID';
$lang->action->objectName = 'Details';

$lang->action->createContact = 'Create';
$lang->action->editComment   = 'Edit Comment';
$lang->action->hide          = 'Hide';       
$lang->action->hideOne       = 'Hide';
$lang->action->hideAll       = 'Hide all';
$lang->action->hidden        = 'Hidden';
$lang->action->undelete      = 'Undelete';
$lang->action->trashTips     = 'Tips:The deletions in Zdoo are tag deletions.';

$lang->action->textDiff = 'Text Mode';
$lang->action->original = 'Original content';

/* The desc of actions. */
$lang->action->desc = new stdclass();
$lang->action->desc->common      = '$date, <strong>$action</strong> by <strong>$actor</strong>.';
$lang->action->desc->extra       = '$date, <strong>$action</strong> as <strong>$extra</strong> by <strong>$actor</strong>.';
$lang->action->desc->opened      = '$date, opened by <strong>$actor</strong>.';
$lang->action->desc->created     = '$date, created by <strong>$actor</strong>.';
$lang->action->desc->edited      = '$date, edited by <strong>$actor</strong>.';
$lang->action->desc->deleted     = '$date, deleted by <strong>$actor</strong>.';
$lang->action->desc->deletedfile = '$date, deleted file by <strong>$actor</strong>, the file is <strong><i>$extra</i></strong>.';
$lang->action->desc->editfile    = '$date, edit file by <strong>$actor</strong>, the file is <strong><i>$extra</i></strong>.';
$lang->action->desc->commented   = '$date, commented by <strong>$actor</strong>.';
$lang->action->desc->activated   = '$date, activated by <strong>$actor</strong>.';
$lang->action->desc->canceled    = '$date, canceled by <strong>$actor</strong>.';
$lang->action->desc->finished    = '$date, finished by <strong>$actor</strong>.';
$lang->action->desc->diff1       = 'changed <strong><i>%s</i></strong>, old is "%s", new is "%s".<br />';
$lang->action->desc->diff2       = 'changed <strong><i>%s</i></strong>, the diff is:' . "\n" . "<blockquote>%s</blockquote>" . "\n<div class='hidden'>%s</div>";
$lang->action->desc->diff3       = "changed file's name %s to %s.";
$lang->action->desc->hidden      = '$date, hidden by <strong>$actor</strong> .' . "\n";
$lang->action->desc->undeleted   = '$date, restored by <strong>$actor</strong> .' . "\n";
$lang->action->desc->ignored     = '$date, ignored by <strong>$actor</strong> .' . "\n";
$lang->action->desc->imported    = '$date, import by <strong>$actor</strong>.' . "\n";

/* The action labels. */
$lang->action->label = new stdclass();
$lang->action->label->created     = 'created';
$lang->action->label->edited      = 'edited';
$lang->action->label->closed      = 'closed';
$lang->action->label->deleted     = 'deleted';
$lang->action->label->undeleted   = 'Restore';
$lang->action->label->deletedfile = 'deleted file';
$lang->action->label->editfile    = 'edit file name';
$lang->action->label->commented   = 'commented';
$lang->action->label->activated   = 'activated';
$lang->action->label->marked      = 'edited';
$lang->action->label->started     = 'started';
$lang->action->label->canceled    = 'cancelled';
$lang->action->label->finished    = 'finished';
$lang->action->label->commited    = 'commited';
$lang->action->label->forbidden   = 'Forbidden';
$lang->action->label->imported    = 'imported';
$lang->action->label->login       = 'login';
$lang->action->label->logout      = 'logout';

/* Display action when search in dynamic view. */
$lang->action->search = new stdclass();
$lang->action->search->label = (array)$lang->action->label;

/* Link of every action. */
$lang->action->label->space = ' ';
$lang->action->label->user  = 'User';

$lang->action->objectTypes['user'] = 'User';

$lang->action->noticeTitle = "%s <a href='%s' data-appid='%s'>%s</a>";
