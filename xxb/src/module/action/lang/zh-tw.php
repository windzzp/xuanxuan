<?php
/**
 * The lang file of zh-tw module of XXB.
 *
 * @copyright   Copyright 2009-2018 青島易軟天創網絡科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     action
 * @version     $Id: zh-tw.php 4955 2013-07-02 01:47:21Z chencongzhi520@gmail.com $
 * @link        http://xuan.im
 */
if(!isset($lang->action)) $lang->action = new stdclass();

$lang->action->common   = '系統日誌';
$lang->action->product  = '產品';
$lang->action->actor    = '操作者';
$lang->action->contact  = '聯繫人';
$lang->action->comment  = '內容';
$lang->action->action   = '動作';
$lang->action->actionID = '記錄ID';
$lang->action->date     = '日期';

$lang->action->trash      = '資源回收筒';
$lang->action->objectType = '對象類型';
$lang->action->objectID   = '對象ID';
$lang->action->objectName = '對象名稱';

$lang->action->createContact = '新建';
$lang->action->editComment   = '修改備註';
$lang->action->hide          = '隱藏';       
$lang->action->hideOne       = '隱藏';
$lang->action->hideAll       = '隱藏全部';
$lang->action->hidden        = '已隱藏';
$lang->action->undelete      = '還原';
$lang->action->trashTips     = '提示：為了保證系統的完整性，然之系統的刪除都是標記刪除。';

$lang->action->textDiff = '文本格式';
$lang->action->original = '原始格式';

/* 用來描述操作歷史記錄。*/
$lang->action->desc = new stdclass();
$lang->action->desc->common      = '$date, <strong>$action</strong> by <strong>$actor</strong>。' . "\n";
$lang->action->desc->extra       = '$date, <strong>$action</strong> as <strong>$extra</strong> by <strong>$actor</strong>。' . "\n";
$lang->action->desc->opened      = '$date, 由 <strong>$actor</strong> 創建。' . "\n";
$lang->action->desc->created     = '$date, 由 <strong>$actor</strong> 創建。' . "\n";
$lang->action->desc->edited      = '$date, 由 <strong>$actor</strong> 編輯。' . "\n";
$lang->action->desc->deleted     = '$date, 由 <strong>$actor</strong> 刪除。' . "\n";
$lang->action->desc->deletedfile = '$date, 由 <strong>$actor</strong> 刪除了附件：<strong><i>$extra</i></strong>。' . "\n";
$lang->action->desc->editfile    = '$date, 由 <strong>$actor</strong> 編輯了附件：<strong><i>$extra</i></strong>。' . "\n";
$lang->action->desc->commented   = '$date, 由 <strong>$actor</strong> 添加備註。' . "\n";
$lang->action->desc->activated   = '$date, 由 <strong>$actor</strong> 激活。' . "\n";
$lang->action->desc->canceled    = '$date, 由 <strong>$actor</strong> 取消。' . "\n";
$lang->action->desc->finished    = '$date, 由 <strong>$actor</strong> 完成。' . "\n";
$lang->action->desc->diff1       = '修改了 <strong><i>%s</i></strong>，舊值為 "%s"，新值為 "%s"。<br />' . "\n";
$lang->action->desc->diff2       = '修改了 <strong><i>%s</i></strong>，區別為：' . "\n" . "<blockquote>%s</blockquote>" . "\n<div class='hidden'>%s</div>";
$lang->action->desc->diff3       = "將檔案名 %s 改為 %s 。\n";
$lang->action->desc->hidden      = '$date, 由 <strong>$actor</strong> 隱藏。' . "\n";
$lang->action->desc->undeleted   = '$date, 由 <strong>$actor</strong> 還原。' . "\n";
$lang->action->desc->ignored     = '$date, 由 <strong>$actor</strong> 忽略。' . "\n";
$lang->action->desc->imported    = '$date, 由 <strong>$actor</strong> 導入。' . "\n";

/* 用來顯示動態信息。*/
$lang->action->label = new stdclass();
$lang->action->label->created     = '創建了';
$lang->action->label->edited      = '編輯了';
$lang->action->label->closed      = '關閉了';
$lang->action->label->deleted     = '刪除了';
$lang->action->label->undeleted   = '還原了';
$lang->action->label->deletedfile = '刪除附件';
$lang->action->label->editfile    = '編輯附件';
$lang->action->label->commented   = '備註了';
$lang->action->label->activated   = '激活了';
$lang->action->label->marked      = '編輯了';
$lang->action->label->started     = '開始了';
$lang->action->label->canceled    = '取消了';
$lang->action->label->finished    = '完成了';
$lang->action->label->commited    = '提交了';
$lang->action->label->forbidden   = '禁用了';
$lang->action->label->imported    = '導入了';
$lang->action->label->login       = '登錄系統';
$lang->action->label->logout      = '退出登錄';

/* 用來做動態搜索中顯示動作 */
$lang->action->search = new stdclass();
$lang->action->search->label = (array)$lang->action->label;

/* 用來生成相應對象的連結。*/
$lang->action->label->space = ' ';
$lang->action->label->user  = '用戶';

$lang->action->objectTypes['user'] = '用戶';

$lang->action->noticeTitle = "%s <a href='%s' data-appid='%s'>%s</a>";
