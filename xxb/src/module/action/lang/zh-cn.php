<?php
/**
 * The lang file of zh-cn module of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Yidong Wang <yidong@cnezsoft.com>
 * @package     action
 * @version     $Id: zh-cn.php 4955 2013-07-02 01:47:21Z chencongzhi520@gmail.com $
 * @link        http://www.ranzhi.org
 */
if(!isset($lang->action)) $lang->action = new stdclass();

$lang->action->common   = '系统日志';
$lang->action->product  = '产品';
$lang->action->actor    = '操作者';
$lang->action->contact  = '联系人';
$lang->action->comment  = '内容';
$lang->action->action   = '动作';
$lang->action->actionID = '记录ID';
$lang->action->date     = '日期';

$lang->action->trash      = '回收站';
$lang->action->objectType = '对象类型';
$lang->action->objectID   = '对象ID';
$lang->action->objectName = '对象名称';

$lang->action->createContact = '新建';
$lang->action->editComment   = '修改备注';
$lang->action->hide          = '隐藏';       
$lang->action->hideOne       = '隐藏';
$lang->action->hideAll       = '隐藏全部';
$lang->action->hidden        = '已隐藏';
$lang->action->undelete      = '还原';
$lang->action->trashTips     = '提示：为了保证系统的完整性，然之系统的删除都是标记删除。';

$lang->action->textDiff = '文本格式';
$lang->action->original = '原始格式';

/* 用来描述操作历史记录。*/
$lang->action->desc = new stdclass();
$lang->action->desc->common      = '$date, <strong>$action</strong> by <strong>$actor</strong>。' . "\n";
$lang->action->desc->extra       = '$date, <strong>$action</strong> as <strong>$extra</strong> by <strong>$actor</strong>。' . "\n";
$lang->action->desc->opened      = '$date, 由 <strong>$actor</strong> 创建。' . "\n";
$lang->action->desc->created     = '$date, 由 <strong>$actor</strong> 创建。' . "\n";
$lang->action->desc->edited      = '$date, 由 <strong>$actor</strong> 编辑。' . "\n";
$lang->action->desc->deleted     = '$date, 由 <strong>$actor</strong> 删除。' . "\n";
$lang->action->desc->deletedfile = '$date, 由 <strong>$actor</strong> 删除了附件：<strong><i>$extra</i></strong>。' . "\n";
$lang->action->desc->editfile    = '$date, 由 <strong>$actor</strong> 编辑了附件：<strong><i>$extra</i></strong>。' . "\n";
$lang->action->desc->commented   = '$date, 由 <strong>$actor</strong> 添加备注。' . "\n";
$lang->action->desc->activated   = '$date, 由 <strong>$actor</strong> 激活。' . "\n";
$lang->action->desc->canceled    = '$date, 由 <strong>$actor</strong> 取消。' . "\n";
$lang->action->desc->finished    = '$date, 由 <strong>$actor</strong> 完成。' . "\n";
$lang->action->desc->diff1       = '修改了 <strong><i>%s</i></strong>，旧值为 "%s"，新值为 "%s"。<br />' . "\n";
$lang->action->desc->diff2       = '修改了 <strong><i>%s</i></strong>，区别为：' . "\n" . "<blockquote>%s</blockquote>" . "\n<div class='hidden'>%s</div>";
$lang->action->desc->diff3       = "将文件名 %s 改为 %s 。\n";
$lang->action->desc->hidden      = '$date, 由 <strong>$actor</strong> 隐藏。' . "\n";
$lang->action->desc->undeleted   = '$date, 由 <strong>$actor</strong> 还原。' . "\n";
$lang->action->desc->ignored     = '$date, 由 <strong>$actor</strong> 忽略。' . "\n";
$lang->action->desc->imported    = '$date, 由 <strong>$actor</strong> 导入。' . "\n";

/* 用来显示动态信息。*/
$lang->action->label = new stdclass();
$lang->action->label->created     = '创建了';
$lang->action->label->edited      = '编辑了';
$lang->action->label->closed      = '关闭了';
$lang->action->label->deleted     = '删除了';
$lang->action->label->undeleted   = '还原了';
$lang->action->label->deletedfile = '删除附件';
$lang->action->label->editfile    = '编辑附件';
$lang->action->label->commented   = '备注了';
$lang->action->label->activated   = '激活了';
$lang->action->label->marked      = '编辑了';
$lang->action->label->started     = '开始了';
$lang->action->label->canceled    = '取消了';
$lang->action->label->finished    = '完成了';
$lang->action->label->commited    = '提交了';
$lang->action->label->forbidden   = '禁用了';
$lang->action->label->imported    = '导入了';
$lang->action->label->login       = '登录系统';
$lang->action->label->logout      = '退出登录';

/* 用来做动态搜索中显示动作 */
$lang->action->search = new stdclass();
$lang->action->search->label = (array)$lang->action->label;

/* 用来生成相应对象的链接。*/
$lang->action->label->space = ' ';
$lang->action->label->user  = '用户';

$lang->action->objectTypes['user'] = '用户';

$lang->action->noticeTitle = "%s <a href='%s' data-appid='%s'>%s</a>";
