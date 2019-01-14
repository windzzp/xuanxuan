<?php
$lang->chat->settings    = '喧喧设置';
$lang->chat->version     = '版本';
$lang->chat->xxbLang     = '服务器端语言';
$lang->chat->key         = '密钥';
$lang->chat->systemGroup = '系统';

$lang->chat->createKey = '重新生成密钥';

$lang->chat->notAdmin         = '不是系统管理员。';
$lang->chat->notSystemChat    = '不是系统会话。';
$lang->chat->notGroupChat     = '不是多人会话。';
$lang->chat->notPublic        = '不是公开会话。';
$lang->chat->cantChat         = '没有发言权限。';
$lang->chat->chatHasDismissed = '讨论组已被解散';
$lang->chat->needLogin        = '用户没有登录。';
$lang->chat->notExist         = '会话不存在。';
$lang->chat->changeRenameTo   = '将会话名称更改为';
$lang->chat->multiChats       = '消息不属于同一个会话。';
$lang->chat->notInGroup       = '用户不在此讨论组内。';

$lang->chat->errorKey = '<strong>密钥</strong> 应该为数字或字母的组合，长度为32位。';

$lang->chat->connector = '、';

$lang->chat->broadcast = new stdclass();
$lang->chat->broadcast->createChat  = '@%s 创建了讨论组 **[%s](#/chats/groups/%s)**。';
$lang->chat->broadcast->joinChat    = '@%s 加入了讨论组。';
$lang->chat->broadcast->quitChat    = '@%s 退出了当前讨论组。';
$lang->chat->broadcast->renameChat  = '@%s 将讨论组名称更改为 **[%s](#/chats/groups/%s)**。';
$lang->chat->broadcast->inviteUser  = '@%s 邀请 %s 加入了讨论组。';
$lang->chat->broadcast->dismissChat = '@%s 解散了当前讨论组。';
