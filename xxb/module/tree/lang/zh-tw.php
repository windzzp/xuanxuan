<?php
/**
 * The tree module zh-tw file of XXB.
 *
 * @copyright   Copyright 2009-2018 青島易軟天創網絡科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     tree
 * @version     $Id: zh-tw.php 4103 2016-09-30 09:22:14Z daitingting $
 * @link        http://xuan.im
 */
$lang->tree->common        = "部門";
$lang->tree->edit          = "編輯部門";
$lang->tree->children      = "添加部門";
$lang->tree->delete        = "刪除部門";
$lang->tree->browse        = "維護部門";
$lang->tree->manage        = "維護類目";

$lang->tree->noCategories  = '您還沒有添加類目，請添加類目。';
$lang->tree->timeCountDown = "<strong id='countDown'>3</strong> 秒後轉向%s管理頁面。";
$lang->tree->redirect      = '立即轉向';
$lang->tree->hasChildren   = '該分類存在子分類，不能刪除。';
$lang->tree->confirmDelete = "您確定刪除該類目嗎？";
$lang->tree->successFixed  = "成功修復";

/* Lang items for article, products. */
$lang->category = new stdclass();
$lang->category->common   = '類目';
$lang->category->name     = '類目名稱';
$lang->category->alias    = '別名';
$lang->category->parent   = '上級類目';
$lang->category->desc     = '描述';
$lang->category->children = '子類目';
$lang->category->rights   = '權限';
$lang->category->users    = '授權用戶';
$lang->category->groups   = '授權分組';
$lang->category->origin   = '源科目';
$lang->category->target   = '目標科目';
