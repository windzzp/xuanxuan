<?php
/**
 * The tree module zh-cn file of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     tree
 * @version     $Id: zh-cn.php 4103 2016-09-30 09:22:14Z daitingting $
 * @link        http://www.ranzhi.org
 */
$lang->tree->common        = "部门";
$lang->tree->edit          = "编辑部门";
$lang->tree->children      = "添加部门";
$lang->tree->delete        = "删除部门";
$lang->tree->browse        = "维护部门";
$lang->tree->manage        = "维护类目";

$lang->tree->noCategories  = '您还没有添加类目，请添加类目。';
$lang->tree->timeCountDown = "<strong id='countDown'>3</strong> 秒后转向%s管理页面。";
$lang->tree->redirect      = '立即转向';
$lang->tree->hasChildren   = '该分类存在子分类，不能删除。';
$lang->tree->confirmDelete = "您确定删除该类目吗？";
$lang->tree->successFixed  = "成功修复";

/* Lang items for article, products. */
$lang->category = new stdclass();
$lang->category->common   = '类目';
$lang->category->name     = '类目名称';
$lang->category->alias    = '别名';
$lang->category->parent   = '上级类目';
$lang->category->desc     = '描述';
$lang->category->children = '子类目';
$lang->category->rights   = '权限';
$lang->category->users    = '授权用户';
$lang->category->groups   = '授权分组';
$lang->category->origin   = '源科目';
$lang->category->target   = '目标科目';
