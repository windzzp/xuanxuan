<?php
/**
 * The user module zh-cn file of RanZhi.
 *
 * @copyright   Copyright 2009-2018 青岛易软天创网络科技有限公司(QingDao Nature Easy Soft Network Technology Co,LTD, www.cnezsoft.com)
 * @license     ZPL (http://zpl.pub/page/zplv12.html)
 * @author      Chunsheng Wang <chunsheng@cnezsoft.com>
 * @package     user
 * @version     $Id: zh-cn.php 4029 2016-08-26 06:50:41Z liugang $
 * @link        http://www.ranzhi.org
 */
$lang->user->common    = '成员';
$lang->user->id        = '编号';
$lang->user->account   = '用户名';
$lang->user->super     = '管理员';
$lang->user->password  = '密码';
$lang->user->password2 = '重复密码';
$lang->user->realname  = '真实姓名';
$lang->user->nickname  = '昵称';
$lang->user->dept      = '所属部门';
$lang->user->role      = '角色';    
$lang->user->avatar    = '头像';
$lang->user->birthyear = '出生年';
$lang->user->birthday  = '出生日期';
$lang->user->gender    = '性别';
$lang->user->email     = '邮箱';
$lang->user->msn       = 'MSN';
$lang->user->qq        = 'QQ';
$lang->user->yahoo     = '雅虎通';
$lang->user->weixin    = '微信号';
$lang->user->gtalk     = 'Gtalk';
$lang->user->wangwang  = '旺旺';
$lang->user->mobile    = '手机';
$lang->user->phone     = '电话';
$lang->user->dept      = '部门';
$lang->user->address   = '通讯地址';
$lang->user->zipcode   = '邮编';
$lang->user->join      = '加入日期';
$lang->user->visits    = '访问次数';
$lang->user->ip        = '最后IP';
$lang->user->last      = '最后登录';
$lang->user->allowTime = '开放时间';
$lang->user->status    = '状态';
$lang->user->alert     = '您的帐号已被禁用';
$lang->user->keepLogin = '保持登录';
$lang->user->ignore    = '忽略';

$lang->user->admin           = '浏览成员';
$lang->user->list            = '成员列表';
$lang->user->colleague       = '同事列表';
$lang->user->view            = "成员详情";
$lang->user->create          = "添加成员";
$lang->user->edit            = "编辑成员";
$lang->user->changePassword  = "更改密码";
$lang->user->recoverPassword = "忘记密码";
$lang->user->newPassword     = "新密码";
$lang->user->update          = "编辑成员";
$lang->user->delete          = "删除成员";
$lang->user->browse          = "浏览成员";
$lang->user->deny            = "访问受限";
$lang->user->confirmDelete   = "您确认删除该成员吗？";
$lang->user->confirmActivate = "您确认激活该成员吗？";
$lang->user->relogin         = "重新登录";
$lang->user->asGuest         = "游客访问";
$lang->user->goback          = "返回前一页";
$lang->user->allUsers        = '全部成员';
$lang->user->submit          = "提交";
$lang->user->forbid          = '禁用';
$lang->user->forbidList      = '禁用成员列表';
$lang->user->normalList      = '普通成员列表';
$lang->user->active          = '激活';
$lang->user->setReferer      = '设置referer';
$lang->user->vcard           = '获取二维码名片';
$lang->user->uploadAvatar    = '上传头像';
$lang->user->cropAvatar      = '裁剪头像';
$lang->user->cropAvatarTip   = '拖拽选框来选择头像裁剪范围';
$lang->user->lang            = '角色';
$lang->user->adminUser       = '组织';

$lang->user->profile     = '个人信息';
$lang->user->editProfile = '编辑信息';
$lang->user->thread      = '我的主题';
$lang->user->reply       = '我的回贴';
$lang->user->message     = '我的消息';

$lang->user->inputAccount   = '请输入用户名';
$lang->user->inputPassword  = '请输入密码';
$lang->user->searchUser     = '搜索';

$lang->user->errorDeny     = "抱歉，您无权访问『<b>%s</b>』模块的『<b>%s</b>』功能。请联系管理员获取权限。点击后退返回上页。<br/> 5秒钟后将自动返回首页...";
$lang->user->loginFailed   = "登录失败，请检查您的成员名或密码是否填写正确。";
$lang->user->locked        = "成员已经被锁定，请%s后再重新尝试登录";
$lang->user->lockedForEver = "成员已经被永久禁用。";
$lang->user->forbidSuccess = '禁用成功';
$lang->user->actionFail    = '操作失败';
$lang->user->uploadSuccess = '上传成功';
$lang->user->actionError   = '操作失败，原因是 %s 存在该用户未审批的数据。';
$lang->user->retainAccount = '不能使用 <strong>%s</strong> 作为用户名。';

$lang->user->forbidUser = '禁用管理';
$lang->user->operate    = '操作';

$lang->user->genderList = $lang->genderList;

$lang->user->basicInfo   = '基本信息';
$lang->user->contactInfo = '联系信息';

$lang->user->statusList = new stdclass();
$lang->user->statusList->locked    = "<label class='label label-danger'>锁定</label>";
$lang->user->statusList->forbidden = "<label class='label label-danger'>禁用</label>";
$lang->user->statusList->normal    = "<label class='label label-success'>正常</label>";

$lang->user->notice = new stdclass();
$lang->user->notice->password = '字母和数字组合，最少六位';

$lang->user->login  = new stdclass();
$lang->user->login->common  = "登录";

$lang->dept = new stdclass();  
$lang->dept->common     = '部门结构';
$lang->dept->name       = '部门名称';
$lang->dept->alias      = '部门别名';
$lang->dept->edit       = '维护部门';
$lang->dept->parent     = '上级部门';
$lang->dept->children   = '子部门';
$lang->dept->desc       = '描述';
$lang->dept->keywords   = '关键词';
$lang->dept->moderators = '部门经理';

$lang->user->roleList['']           = ''; 
$lang->user->roleList['dev']        = '研发';
$lang->user->roleList['pm']         = '项目经理';
$lang->user->roleList['market']     = '市场';
$lang->user->roleList['sale']       = '销售';
$lang->user->roleList['hr']         = '人事';
$lang->user->roleList['office']     = '行政';
$lang->user->roleList['service']    = '客服';
$lang->user->roleList['support']    = '技术支持';
$lang->user->roleList['marketmgr']  = '市场主管';
$lang->user->roleList['salemgr']    = '销售经理';
$lang->user->roleList['hrmgr']      = '人事主管';
$lang->user->roleList['adminmgr']   = '行政主管';
$lang->user->roleList['servicemgr'] = '客服主管';
$lang->user->roleList['supportmgr'] = '技术支持主管';
$lang->user->roleList['top']        = '高层管理';
$lang->user->roleList['others']     = '其他';
